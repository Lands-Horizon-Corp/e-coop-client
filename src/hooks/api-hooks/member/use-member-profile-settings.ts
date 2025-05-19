import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as MemberProfileService from '@/api-service/member-services/member-profile-service'

import {
    IAPIHook,
    TEntityId,
    IMemberAsset,
    IMemberIncome,
    IMemberProfile,
    IMutationProps,
    IMemberAddress,
    IMemberExpense,
    IMemberJointAccount,
    IMemberAssetRequest,
    IMemberIncomeRequest,
    IMemberExpenseRequest,
    IMemberAddressRequest,
    IMemberContactReference,
    IMemberGovernmentBenefit,
    IMemberJointAccountRequest,
    IMemberProfileMediasRequest,
    IMemberProfileAccountRequest,
    IMemberEducationalAttainment,
    IMemberContactReferenceRequest,
    IMemberGovernmentBenefitRequest,
    IMemberProfilePersonalInfoRequest,
    IMemberProfileMembershipInfoRequest,
    IMemberEducationalAttainmentRequest,
    IMemberRelativeAccount,
    IMemberRelativeAccountRequest,
} from '@/types'
import { createMutationHook } from '../api-hook-factory'

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

// MEMBER ADDRESS

export const useCreateMemberProfileAddress = createMutationHook<
    IMemberAddress,
    string,
    {
        memberProfileId: TEntityId
        data: Omit<IMemberAddressRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, data }) =>
        MemberProfileService.createMemberProfileAddress(memberProfileId, data),
    'Address created'
)

export const useUpdateMemberProfileAddress = createMutationHook<
    IMemberAddress,
    string,
    {
        memberProfileId: TEntityId
        memberAddressId: TEntityId
        data: Omit<IMemberAddressRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, memberAddressId, data }) =>
        MemberProfileService.updateMemberProfileAddress(
            memberProfileId,
            memberAddressId,
            data
        ),
    'Address updated'
)

export const useDeleteMemberProfileAddress = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; memberAddressId: TEntityId }
>(
    ({ memberProfileId, memberAddressId }) =>
        MemberProfileService.deleteMemberProfileAddress(
            memberProfileId,
            memberAddressId
        ),
    'Address deleted'
)

// MEMBER CONTACT

export const useCreateMemberProfileContactReference = createMutationHook<
    IMemberContactReference,
    string,
    {
        memberProfileId: TEntityId
        data: Omit<IMemberContactReferenceRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, data }) =>
        MemberProfileService.createMemberProfileContactReference(
            memberProfileId,
            data
        ),
    'Contact reference created'
)

export const useUpdateMemberProfileContactReference = createMutationHook<
    IMemberContactReference,
    string,
    {
        memberProfileId: TEntityId
        contactReferenceId: TEntityId
        data: Omit<IMemberContactReferenceRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, contactReferenceId, data }) =>
        MemberProfileService.updateMemberProfileContactReference(
            memberProfileId,
            contactReferenceId,
            data
        ),
    'Contact reference updated'
)

export const useDeleteMemberProfileContactReference = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; contactReferenceId: TEntityId }
>(
    ({ memberProfileId, contactReferenceId }) =>
        MemberProfileService.deleteMemberProfileContactReference(
            memberProfileId,
            contactReferenceId
        ),
    'Contact reference deleted'
)

// MEMBER ASSET

export const useCreateMemberProfileAsset = createMutationHook<
    IMemberAsset,
    string,
    {
        memberProfileId: TEntityId
        data: Omit<IMemberAssetRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, data }) =>
        MemberProfileService.createMemberProfileAsset(memberProfileId, data),
    'Asset created'
)

export const useUpdateMemberProfileAsset = createMutationHook<
    IMemberAsset,
    string,
    {
        memberProfileId: TEntityId
        assetId: TEntityId
        data: Omit<IMemberAssetRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, assetId, data }) =>
        MemberProfileService.updateMemberProfileAsset(
            memberProfileId,
            assetId,
            data
        ),
    'Asset updated'
)

export const useDeleteMemberProfileAsset = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; assetId: TEntityId }
>(
    ({ memberProfileId, assetId }) =>
        MemberProfileService.deleteMemberProfileAsset(memberProfileId, assetId),
    'Asset deleted'
)

// MEMBER INCOME

export const useCreateMemberProfileIncome = createMutationHook<
    IMemberIncome,
    string,
    {
        memberProfileId: TEntityId
        data: Omit<IMemberIncomeRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, data }) =>
        MemberProfileService.createMemberProfileIncome(memberProfileId, data),
    'Income created'
)

export const useUpdateMemberProfileIncome = createMutationHook<
    IMemberIncome,
    string,
    {
        memberProfileId: TEntityId
        incomeId: TEntityId
        data: Omit<IMemberIncomeRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, incomeId, data }) =>
        MemberProfileService.updateMemberProfileIncome(
            memberProfileId,
            incomeId,
            data
        ),
    'Income updated'
)

export const useDeleteMemberProfileIncome = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; incomeId: TEntityId }
>(
    ({ memberProfileId, incomeId }) =>
        MemberProfileService.deleteMemberProfileIncome(
            memberProfileId,
            incomeId
        ),
    'Income deleted'
)

// MEMBER EXPENSE

export const useCreateMemberProfileExpense = createMutationHook<
    IMemberExpense,
    string,
    {
        memberProfileId: TEntityId
        data: Omit<IMemberExpenseRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, data }) =>
        MemberProfileService.createMemberProfileExpense(memberProfileId, data),
    'Expense created'
)

export const useUpdateMemberProfileExpense = createMutationHook<
    IMemberExpense,
    string,
    {
        memberProfileId: TEntityId
        expenseId: TEntityId
        data: Omit<IMemberExpenseRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, expenseId, data }) =>
        MemberProfileService.updateMemberProfileExpense(
            memberProfileId,
            expenseId,
            data
        ),
    'Expense updated'
)

export const useDeleteMemberProfileExpense = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; expenseId: TEntityId }
>(
    ({ memberProfileId, expenseId }) =>
        MemberProfileService.deleteMemberProfileExpense(
            memberProfileId,
            expenseId
        ),
    'Expense deleted'
)

// MEMBER GOVERNMENT BENEFIT

export const useCreateMemberGovernmentBenefit = createMutationHook<
    IMemberGovernmentBenefit,
    string,
    {
        memberProfileId: TEntityId
        data: Omit<
            IMemberGovernmentBenefitRequest,
            'member_profile_id' | 'branch_id' | 'organization_id'
        >
    }
>(
    ({ memberProfileId, data }) =>
        MemberProfileService.createMemberGovernmentBenefit(
            memberProfileId,
            data
        ),
    'Government benefit created'
)

export const useUpdateMemberGovernmentBenefit = createMutationHook<
    IMemberGovernmentBenefit,
    string,
    {
        memberProfileId: TEntityId
        benefitId: TEntityId
        data: Omit<
            IMemberGovernmentBenefitRequest,
            'member_profile_id' | 'branch_id' | 'organization_id'
        >
    }
>(
    ({ memberProfileId, benefitId, data }) =>
        MemberProfileService.updateMemberGovernmentBenefit(
            memberProfileId,
            benefitId,
            data
        ),
    'Government benefit updated'
)

export const useDeleteMemberGovernmentBenefit = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; benefitId: TEntityId }
>(
    ({ memberProfileId, benefitId }) =>
        MemberProfileService.deleteMemberGovernmentBenefit(
            memberProfileId,
            benefitId
        ),
    'Government benefit deleted'
)

// MEMBER JOINT ACCOUNT

export const useCreateMemberJointAccount = createMutationHook<
    IMemberJointAccount,
    string,
    {
        memberProfileId: TEntityId
        data: Omit<IMemberJointAccountRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, data }) =>
        MemberProfileService.createMemberJointAccount(memberProfileId, data),
    'Joint account created'
)

export const useUpdateMemberJointAccount = createMutationHook<
    IMemberJointAccount,
    string,
    {
        memberProfileId: TEntityId
        jointAccountId: TEntityId
        data: Omit<IMemberJointAccountRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, jointAccountId, data }) =>
        MemberProfileService.updateMemberJointAccount(
            memberProfileId,
            jointAccountId,
            data
        ),
    'Joint account updated'
)

export const useDeleteMemberJointAccount = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; jointAccountId: TEntityId }
>(
    ({ memberProfileId, jointAccountId }) =>
        MemberProfileService.deleteMemberJointAccount(
            memberProfileId,
            jointAccountId
        ),
    'Joint account deleted'
)

// MEMBER RELATIVE ACCOUNT

export const useCreateMemberRelativeAccount = createMutationHook<
    IMemberRelativeAccount,
    string,
    {
        memberProfileId: TEntityId
        data: Omit<IMemberRelativeAccountRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, data }) =>
        MemberProfileService.createMemberRelativeAccount(memberProfileId, data),
    'Relative account created'
)

export const useUpdateMemberRelativeAccount = createMutationHook<
    IMemberRelativeAccount,
    string,
    {
        memberProfileId: TEntityId
        relativeAccountId: TEntityId
        data: Omit<IMemberRelativeAccountRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, relativeAccountId, data }) =>
        MemberProfileService.updateMemberRelativeAccount(
            memberProfileId,
            relativeAccountId,
            data
        ),
    'Relative account updated'
)

export const useDeleteMemberRelativeAccount = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; relativeAccountId: TEntityId }
>(
    ({ memberProfileId, relativeAccountId }) =>
        MemberProfileService.deleteMemberRelativeAccount(
            memberProfileId,
            relativeAccountId
        ),
    'Relative account deleted'
)
