import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'

import {
    IMemberProfileRequest,
    IMemberProfileResource,
} from '@/types/coop-types/member/member-profile'
import { IMemberCloseRemarkRequest, TEntityId } from '@/types'
import { IAPIHook, IMutationProps, IQueryProps } from '../types'
import MemberProfileService from '@/api-service/member-services/member-profile-service'

export const useCreateMemberProfile = ({
    showMessage = true,
    preloads = ['Media'],
    onSuccess,
    onError,
}:
    | undefined
    | (IAPIHook<IMemberProfileResource, string> & IQueryProps) = {}) => {
    const queryClient = useQueryClient()

    return useMutation<IMemberProfileResource, string, IMemberProfileRequest>({
        mutationKey: ['member-profile', 'create'],
        mutationFn: async (data) => {
            const [error, newMember] = await withCatchAsync(
                MemberProfileService.create(data, preloads)
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

            queryClient.setQueryData<IMemberProfileResource>(
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
}: { profileId: TEntityId } & IAPIHook<IMemberProfileResource, string> &
    IQueryProps<IMemberProfileResource>) => {
    return useQuery<IMemberProfileResource, string>({
        queryKey: ['member-profile', profileId],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                MemberProfileService.getById(profileId, preloads)
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
}:
    | undefined
    | (IAPIHook<IMemberProfileResource, string> & IMutationProps) = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberProfileResource,
        string,
        { id: TEntityId; data: IMemberProfileRequest }
    >({
        mutationKey: ['member-profile', 'update'],
        mutationFn: async ({ id, data }) => {
            const [error, updatedMember] = await withCatchAsync(
                MemberProfileService.update(id, data, preloads)
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

            queryClient.setQueryData<IMemberProfileResource>(
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
}: IAPIHook<IMemberProfileResource, string> & IMutationProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberProfileResource,
        string,
        { profileId: TEntityId; data: IMemberCloseRemarkRequest[] }
    >({
        mutationKey: ['member-profile', 'close-account'],
        mutationFn: async ({ profileId, data }) => {
            const [error, closedMember] = await withCatchAsync(
                MemberProfileService.closeAccount(profileId, data, preloads)
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

            queryClient.setQueryData<IMemberProfileResource>(
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
