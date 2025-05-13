import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as MemberProfileService from '@/api-service/member-services/member-profile-service'

import {
    IAPIHook,
    TEntityId,
    IQueryProps,
    IMutationProps,
    IMemberProfile,
    IMemberProfileRequest,
    IMemberProfilePaginated,
    IAPIFilteredPaginatedHook,
    IMemberCloseRemarkRequest,
} from '@/types'

export const useCreateMemberProfile = ({
    showMessage = true,
    preloads = ['Media'],
    onSuccess,
    onError,
}: undefined | (IAPIHook<IMemberProfile, string> & IQueryProps) = {}) => {
    const queryClient = useQueryClient()

    return useMutation<IMemberProfile, string, IMemberProfileRequest>({
        mutationKey: ['member-profile', 'create'],
        mutationFn: async (data) => {
            const [error, newMember] = await withCatchAsync(
                MemberProfileService.createMemberProfile(data, preloads)
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

export const useMemberProfile = ({
    profileId,
    preloads = ['Media', 'Owner', 'Owner.Media'],
    onError,
    onSuccess,
    ...opts
}: { profileId: TEntityId } & IAPIHook<IMemberProfile, string> &
    IQueryProps<IMemberProfile>) => {
    return useQuery<IMemberProfile, string>({
        queryKey: ['member-profile', profileId],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                MemberProfileService.getMemberProfileById(profileId, preloads)
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

export const useUpdateMemberProfile = ({
    showMessage = true,
    preloads = ['Media'],
    onSuccess,
    onError,
}: undefined | (IAPIHook<IMemberProfile, string> & IMutationProps) = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberProfile,
        string,
        { id: TEntityId; data: IMemberProfileRequest }
    >({
        mutationKey: ['member-profile', 'update'],
        mutationFn: async ({ id, data }) => {
            const [error, updatedMember] = await withCatchAsync(
                MemberProfileService.updateMemberProfile(id, data, preloads)
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
                ['member-profile', updatedMember.id],
                updatedMember
            )

            queryClient.invalidateQueries({
                queryKey: ['member', updatedMember.id],
            })
            queryClient.removeQueries({
                queryKey: ['member', 'loader', updatedMember.id],
            })

            if (showMessage) toast.success('Member Profile Updated')
            onSuccess?.(updatedMember)

            return updatedMember
        },
    })
}

export const useCloseMemberProfile = ({
    showMessage = true,
    preloads = ['Media'],
    onSuccess,
    onError,
    ...other
}: IAPIHook<IMemberProfile, string> & IMutationProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberProfile,
        string,
        { profileId: TEntityId; data: IMemberCloseRemarkRequest[] }
    >({
        mutationKey: ['member-profile', 'close-account'],
        mutationFn: async ({ profileId, data }) => {
            const [error, closedMember] = await withCatchAsync(
                MemberProfileService.closeMemberProfileAccount(
                    profileId,
                    data,
                    preloads
                )
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
                ['member-profile', closedMember.id],
                closedMember
            )

            queryClient.invalidateQueries({
                queryKey: ['member', closedMember.id],
            })

            queryClient.removeQueries({
                queryKey: ['member', 'loader', closedMember.id],
            })

            if (showMessage) toast.success('Member Profile Updated')
            onSuccess?.(closedMember)

            return closedMember
        },
        ...other,
    })
}

export const useFilteredPaginatedMemberProfile = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberProfile, string> & IQueryProps = {}) => {
    return useQuery<IMemberProfilePaginated, string>({
        queryKey: ['gender', 'resource-query', filterPayload, pagination, sort],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberProfileService.getPaginatedMemberProfile({
                    preloads,
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
        initialData: {
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
