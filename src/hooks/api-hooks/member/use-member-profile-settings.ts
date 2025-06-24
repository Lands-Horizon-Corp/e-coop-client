import * as MemberProfileService from '@/api-service/member-services/member-profile-service'

import {
    TEntityId,
    IMemberAsset,
    IMemberIncome,
    IMemberProfile,
    IMemberAddress,
    IMemberExpense,
    IMemberJointAccount,
    IMemberAssetRequest,
    IMemberIncomeRequest,
    IMemberExpenseRequest,
    IMemberAddressRequest,
    IMemberRelativeAccount,
    IMemberContactReference,
    IMemberGovernmentBenefit,
    IMemberJointAccountRequest,
    IMemberEducationalAttainment,
    IMemberRelativeAccountRequest,
    IMemberContactReferenceRequest,
    IMemberGovernmentBenefitRequest,
    IMemberProfileUserAccountRequest,
    IMemberProfilePersonalInfoRequest,
    IMemberProfileMembershipInfoRequest,
    IMemberEducationalAttainmentRequest,
} from '@/types'
import {
    createMutationHook,
    createMutationInvalidateFn,
    updateMutationInvalidationFn,
} from '../../../factory/api-hook-factory'

export const useUpdateMemberProfilePersonalInfo = createMutationHook<
    IMemberProfile,
    string,
    { memberId: TEntityId; data: IMemberProfilePersonalInfoRequest }
>(
    ({ memberId, data }) =>
        MemberProfileService.updateMemberProfilePersonalInfo(memberId, data),
    'Member general info has been saved',
    (args) => updateMutationInvalidationFn('member-profile', args)
)

export const useUpdateMemberProfileMembershipInfo = createMutationHook<
    IMemberProfile,
    string,
    { memberId: TEntityId; data: IMemberProfileMembershipInfoRequest }
>(
    ({ memberId, data }) =>
        MemberProfileService.updateMemberProfileMembershipInfo(memberId, data),
    'Updated membership info.',
    (args) => updateMutationInvalidationFn('member-profile', args)
)

// MEMBER PROFILE ACCOUNT CONNECTION

export const useCreateMemberProfileUserAccount = createMutationHook<
    IMemberProfile,
    string,
    {
        memberProfileId: TEntityId
        data: IMemberProfileUserAccountRequest
    }
>(
    ({ memberProfileId, data }) =>
        MemberProfileService.createMemberProfileUserAccount(
            memberProfileId,
            data
        ),
    'User account created for Member Profile',
    (args) => createMutationInvalidateFn('member-profile', args)
)

export const useUpdateMemberProfileUserAccount = createMutationHook<
    IMemberProfile,
    string,
    {
        userId: TEntityId
        memberProfileId: TEntityId
        data: IMemberProfileUserAccountRequest
    }
>(
    ({ userId, data }) =>
        MemberProfileService.updateMemberProfileUserAccount(userId, data),
    'Member profile user account updated',
    (args) => updateMutationInvalidationFn('member-profile', args)
)

export const useDisconnectMemberProfileUserAccount = createMutationHook<
    IMemberProfile,
    string,
    {
        memberProfileId: TEntityId
    }
>(
    ({ memberProfileId }) =>
        MemberProfileService.disconnectMemberProfileUserAccount(
            memberProfileId
        ),
    'Disconnected member profile user account',
    ({ queryClient, payload }) =>
        queryClient.invalidateQueries({
            queryKey: ['member-profile', payload.memberProfileId],
        })
)

export const useConnectMemberProfileToUserAccount = createMutationHook<
    IMemberProfile,
    string,
    { memberProfileId: TEntityId; userId: TEntityId }
>(
    ({ memberProfileId, userId }) =>
        MemberProfileService.connectMemberProfileToUserAccount(
            memberProfileId,
            userId
        ),
    'Member Profile Connected to User',
    (args) => updateMutationInvalidationFn('member-profile', args)
)

// EDUC ATTAINMENT UPDATE MEMBER_PROFILE > SETTINGS

export const useCreateEducationalAttainmentForMember = createMutationHook<
    IMemberEducationalAttainment,
    string,
    {
        memberProfileId: TEntityId
        data: Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>
    }
>(
    ({ memberProfileId, data }) =>
        MemberProfileService.createEducationalAttainmentForMember(
            memberProfileId,
            data
        ),
    'Educational Attainment Added',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
)

export const useUpdateEducationalAttainmentForMember = createMutationHook<
    IMemberEducationalAttainment,
    string,
    {
        memberProfileId: TEntityId
        educationalAttainmentId: TEntityId
        data: Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>
    }
>(
    ({ educationalAttainmentId, data }) =>
        MemberProfileService.updateEducationalAttainmentForMember(
            educationalAttainmentId,
            data
        ),
    'Educational Attainment Updated',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
)

export const useDeleteEducationalAttainment = createMutationHook<
    void,
    string,
    { memberProfileId: TEntityId; educationalAttainmentId: TEntityId }
>(
    ({ educationalAttainmentId }) =>
        MemberProfileService.deleteEducationalAttainmentForMember(
            educationalAttainmentId
        ),
    'Educational Attainment Deleted',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
)

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
    'Address created',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    ({ memberAddressId, data }) =>
        MemberProfileService.updateMemberProfileAddress(memberAddressId, data),
    'Address updated',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
)

export const useDeleteMemberProfileAddress = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; memberAddressId: TEntityId }
>(
    ({ memberAddressId }) =>
        MemberProfileService.deleteMemberProfileAddress(memberAddressId),
    'Address deleted',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    'Contact reference created',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    ({ contactReferenceId, data }) =>
        MemberProfileService.updateMemberProfileContactReference(
            contactReferenceId,
            data
        ),
    'Contact reference updated',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
)

export const useDeleteMemberProfileContactReference = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; contactReferenceId: TEntityId }
>(
    ({ contactReferenceId }) =>
        MemberProfileService.deleteMemberProfileContactReference(
            contactReferenceId
        ),
    'Contact reference deleted',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    'Asset created',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    ({ assetId, data }) =>
        MemberProfileService.updateMemberProfileAsset(assetId, data),
    'Asset updated',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
)

export const useDeleteMemberProfileAsset = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; assetId: TEntityId }
>(
    ({ assetId }) => MemberProfileService.deleteMemberProfileAsset(assetId),
    'Asset deleted',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    'Income created',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    ({ incomeId, data }) =>
        MemberProfileService.updateMemberProfileIncome(incomeId, data),
    'Income updated',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
)

export const useDeleteMemberProfileIncome = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; incomeId: TEntityId }
>(
    ({ incomeId }) => MemberProfileService.deleteMemberProfileIncome(incomeId),
    'Income deleted',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    'Expense created',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    ({ expenseId, data }) =>
        MemberProfileService.updateMemberProfileExpense(expenseId, data),
    'Expense updated',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
)

export const useDeleteMemberProfileExpense = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; expenseId: TEntityId }
>(
    ({ expenseId }) =>
        MemberProfileService.deleteMemberProfileExpense(expenseId),
    'Expense deleted',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    'Government benefit created',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    ({ benefitId, data }) =>
        MemberProfileService.updateMemberGovernmentBenefit(benefitId, data),
    'Government benefit updated',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
)

export const useDeleteMemberGovernmentBenefit = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; benefitId: TEntityId }
>(
    ({ benefitId }) =>
        MemberProfileService.deleteMemberGovernmentBenefit(benefitId),
    'Government benefit deleted',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    'Joint account created',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    ({ jointAccountId, data }) =>
        MemberProfileService.updateMemberJointAccount(jointAccountId, data),
    'Joint account updated',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
)

export const useDeleteMemberJointAccount = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; jointAccountId: TEntityId }
>(
    ({ jointAccountId }) =>
        MemberProfileService.deleteMemberJointAccount(jointAccountId),
    'Joint account deleted',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    'Relative account created',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
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
    ({ relativeAccountId, data }) =>
        MemberProfileService.updateMemberRelativeAccount(
            relativeAccountId,
            data
        ),
    'Relative account updated',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
)

export const useDeleteMemberRelativeAccount = createMutationHook<
    unknown,
    string,
    { memberProfileId: TEntityId; relativeAccountId: TEntityId }
>(
    ({ relativeAccountId }) =>
        MemberProfileService.deleteMemberRelativeAccount(relativeAccountId),
    'Relative account deleted',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile', args.payload.memberProfileId],
        })
    }
)
