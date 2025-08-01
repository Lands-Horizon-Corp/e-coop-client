import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as MemberProfileService from '@/api-service/member-services/member-profile-service'
import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IMemberCloseRemarkRequest,
    IMemberProfile,
    IMemberProfilePaginated,
    IMemberProfileQuickCreateRequest,
    IMemberProfileRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useMemberProfile = ({
    profileId,
    onError,
    onSuccess,
    ...opts
}: { profileId: TEntityId } & IAPIHook<IMemberProfile, string> &
    IQueryProps<IMemberProfile>) => {
    return useQuery<IMemberProfile, string>({
        queryKey: ['member-profile', profileId],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                MemberProfileService.getMemberProfileById(profileId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(data)
            return data
        },
        ...opts,
    })
}

// DELETE THIS IN FUTURE IF NOT USED
export const useCreateMemberProfile = ({
    showMessage = true,
    onSuccess,
    onError,
}: undefined | (IAPIHook<IMemberProfile, string> & IQueryProps) = {}) => {
    const queryClient = useQueryClient()

    return useMutation<IMemberProfile, string, IMemberProfileRequest>({
        mutationKey: ['member-profile', 'create'],
        mutationFn: async (data) => {
            const [error, newMember] = await withCatchAsync(
                MemberProfileService.createMemberProfile(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member', 'resource-query'],
            })

            queryClient.setQueryData<IMemberProfile>(
                ['member-profile', newMember.id],
                newMember
            )

            queryClient.invalidateQueries({
                queryKey: ['member', newMember.id],
            })

            queryClient.removeQueries({
                queryKey: ['member', 'loader', newMember.id],
            })

            if (showMessage) toast.success('Member Profile Created')
            onSuccess?.(newMember)

            return newMember
        },
    })
}

export const useQuickCreateMemberProfile = createMutationHook<
    IMemberProfile,
    string,
    IMemberProfileQuickCreateRequest
>(
    (data) =>
        MemberProfileService.quickCreateMemberProfile({
            ...data,
            full_name: `${data.first_name ?? ''} ${data.middle_name ?? ''} ${data.last_name ?? ''} ${data.suffix ?? ''}`,
        }),
    'Member Created',
    (args) => createMutationInvalidateFn('member-profile', args)
)

export const useDeleteMemberProfile = createMutationHook<
    void,
    string,
    TEntityId
>(
    (id) => MemberProfileService.deleteMemberProfile(id),
    'Member profile deleted',
    (args) => deleteMutationInvalidationFn('member-profile', args)
)

export const useUpdateMemberProfile = createMutationHook<
    IMemberProfile,
    string,
    { id: TEntityId; data: IMemberProfileRequest }
>(
    ({ id, data }) => MemberProfileService.updateMemberProfile(id, data),
    'Member Profile Updated',
    (args) => updateMutationInvalidationFn('member-profile', args)
)

export const useCloseMemberProfile = createMutationHook<
    IMemberProfile,
    string,
    { profileId: TEntityId; data: IMemberCloseRemarkRequest[] }
>(
    ({ profileId, data }) =>
        MemberProfileService.closeMemberProfileAccount(profileId, data),
    'Member profile closed',
    (args) => {
        deleteMutationInvalidationFn('member-profile', args)
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.profileId],
        })
    }
)

export const useApproveMemberProfile = createMutationHook<
    IMemberProfile,
    string,
    TEntityId
>(
    (id) => MemberProfileService.approveMemberProfile(id),
    'Member profile approved',
    (args) => {
        updateMutationInvalidationFn('member-profile', args)
    }
)

export const useDeclineMemberProfile = createMutationHook<
    IMemberProfile,
    string,
    TEntityId
>(
    (id) => MemberProfileService.declineMemberProfile(id),
    'Member profile rejected',
    (args) => {
        updateMutationInvalidationFn('member-profile', args)
    }
)

export const useAllPendingMemberProfiles = ({
    enabled,
    showMessage = true,
}: IAPIHook<IMemberProfile[], string> & IQueryProps = {}) => {
    return useQuery<IMemberProfile[], string>({
        queryKey: ['member-profile', 'all', 'pending'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberProfileService.getAllPendingMemberProfile()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: [],
        enabled,
        retry: 1,
    })
}

export const useFilteredPaginatedMemberProfile = ({
    sort,
    enabled,
    initialData,
    mode = 'all',
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberProfile, string> &
    IQueryProps<IMemberProfilePaginated> & { mode?: 'all' | 'pendings' }) => {
    return useQuery<IMemberProfilePaginated, string>({
        queryKey: [
            'member-profile',
            'resource-query',
            mode,
            filterPayload,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberProfileService.getPaginatedMemberProfile({
                    mode,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: initialData ?? {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}
