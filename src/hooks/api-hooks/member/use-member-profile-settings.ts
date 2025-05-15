import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as MemberProfileService from '@/api-service/member-services/member-profile-service'

import {
    IAPIHook,
    TEntityId,
    IMemberProfile,
    IMutationProps,
    IMemberProfileMediasRequest,
    IMemberProfileAccountRequest,
    IMemberEducationalAttainment,
    IMemberProfilePersonalInfoRequest,
    IMemberProfileMembershipInfoRequest,
    IMemberEducationalAttainmentRequest,
} from '@/types'

export const useUpdateMemberProfilePersonalInfo = ({
    onError,
    onSuccess,
    showMessage,
}: IAPIHook<IMemberProfile, string> & IMutationProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberProfile,
        string,
        { memberId: TEntityId; data: IMemberProfilePersonalInfoRequest }
    >({
        mutationKey: ['member-profile', 'update-personal-info'],
        mutationFn: async ({ memberId, data }) => {
            const [error, result] = await withCatchAsync(
                MemberProfileService.updateMemberProfilePersonalInfo(
                    memberId,
                    data
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-profile', memberId],
            })

            if (showMessage) toast.success('Personal info updated')
            onSuccess?.(result)

            return result
        },
    })
}

export const useUpdateMemberProfileMembershipInfo = ({
    onError,
    onSuccess,
    showMessage,
}: IAPIHook<IMemberProfile, string> & IMutationProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberProfile,
        string,
        { memberId: TEntityId; data: IMemberProfileMembershipInfoRequest }
    >({
        mutationKey: ['member-profile', 'update-membership-info'],
        mutationFn: async ({ memberId, data }) => {
            const [error, result] = await withCatchAsync(
                MemberProfileService.updateMemberProfileMembershipInfo(
                    memberId,
                    data
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-profile', memberId],
            })

            if (showMessage) toast.success('Membership info updated')
            onSuccess?.(result)

            return result
        },
    })
}

export const useUpdateMemberProfileAccountInfo = ({
    onError,
    onSuccess,
    showMessage,
}: IAPIHook<IMemberProfile, string> & IMutationProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberProfile,
        string,
        { memberId: TEntityId; data: IMemberProfileAccountRequest }
    >({
        mutationKey: ['member-profile', 'update-account-info'],
        mutationFn: async ({ memberId, data }) => {
            const [error, result] = await withCatchAsync(
                MemberProfileService.updateMemberProfileAccountInfo(
                    memberId,
                    data
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-profile', memberId],
            })

            if (showMessage) toast.success('Account info updated')
            onSuccess?.(result)

            return result
        },
    })
}

export const useUpdateMemberProfilePhotoSignature = ({
    onError,
    onSuccess,
    showMessage,
}: IAPIHook<IMemberProfile, string> & IMutationProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberProfile,
        string,
        { memberId: TEntityId; data: IMemberProfileMediasRequest }
    >({
        mutationKey: ['member-profile', 'update-medias'],
        mutationFn: async ({ memberId, data }) => {
            const [error, result] = await withCatchAsync(
                MemberProfileService.updateMemberProfileMediasPhotoSignature(
                    memberId,
                    data
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-profile', memberId],
            })

            if (showMessage) toast.success('Account info updated')
            onSuccess?.(result)

            return result
        },
    })
}

// EDUC ATTAINMENT UPDATE MEMBER_PROFILE > SETTINGS

export const useCreateEducationalAttainmentForMember = ({
    onError,
    onSuccess,
    showMessage,
}: IAPIHook<IMemberEducationalAttainment, string> & IMutationProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberEducationalAttainment,
        string,
        {
            memberProfileId: TEntityId
            data: Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>
        }
    >({
        mutationKey: ['member-profile', 'create-educational-attainment'],
        mutationFn: async ({ memberProfileId, data }) => {
            const [error, result] = await withCatchAsync(
                MemberProfileService.createEducationalAttainmentForMember(
                    memberProfileId,
                    data
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-profile', memberProfileId],
            })

            if (showMessage) toast.success('Educational attainment added')
            onSuccess?.(result)
            return result
        },
    })
}

export const useUpdateEducationalAttainmentForMember = ({
    onError,
    onSuccess,
    showMessage,
}: IAPIHook<IMemberEducationalAttainment, string> & IMutationProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberEducationalAttainment,
        string,
        {
            memberProfileId: TEntityId
            educationalAttainmentId: TEntityId
            data: Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>
        }
    >({
        mutationKey: ['member-profile', 'update-educational-attainment'],
        mutationFn: async ({
            memberProfileId,
            educationalAttainmentId,
            data,
        }) => {
            const [error, result] = await withCatchAsync(
                MemberProfileService.updateEducationalAttainmentForMember(
                    memberProfileId,
                    educationalAttainmentId,
                    data
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-profile', memberProfileId],
            })

            if (showMessage) toast.success('Educational attainment updated')
            onSuccess?.(result)
            return result
        },
    })
}

export const useDeleteEducationalAttainmentForMember = ({
    onError,
    onSuccess,
    showMessage,
}: IAPIHook<void, string> & IMutationProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        void,
        string,
        { memberProfileId: TEntityId; educationalAttainmentId: TEntityId }
    >({
        mutationKey: ['member-profile', 'delete-educational-attainment'],
        mutationFn: async ({ memberProfileId, educationalAttainmentId }) => {
            const [error] = await withCatchAsync(
                MemberProfileService.deleteEducationalAttainmentForMember(
                    memberProfileId,
                    educationalAttainmentId
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-profile', memberProfileId],
            })

            if (showMessage) toast.success('Educational attainment deleted')
            onSuccess?.()
        },
    })
}
