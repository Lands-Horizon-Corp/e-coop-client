import qs from 'query-string'

import { downloadFileService } from '@/helpers'

import {
    IMemberAddress,
    IMemberAddressRequest,
    IMemberAsset,
    IMemberAssetRequest,
    IMemberCloseRemarkRequest,
    IMemberContactReference,
    IMemberContactReferenceRequest,
    IMemberEducationalAttainment,
    IMemberEducationalAttainmentRequest,
    IMemberExpense,
    IMemberExpenseRequest,
    IMemberGovernmentBenefit,
    IMemberGovernmentBenefitRequest,
    IMemberIncome,
    IMemberIncomeRequest,
    IMemberJointAccount,
    IMemberJointAccountRequest,
    IMemberProfile,
    IMemberProfileAccountRequest,
    IMemberProfileMediasRequest,
    IMemberProfileMembershipInfoRequest,
    IMemberProfilePaginated,
    IMemberProfilePersonalInfoRequest,
    IMemberProfileQuickCreateRequest,
    IMemberProfileRequest,
    IMemberProfileUserAccountRequest,
    IMemberRelativeAccount,
    IMemberRelativeAccountRequest,
    TEntityId,
} from '@/types'

import APIService from '../api-service'

const BASE_ENDPOINT = '/member-profile'

export const quickCreateMemberProfile = async (
    data: IMemberProfileQuickCreateRequest
) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/quick-create`,
        },
        { skipNull: true }
    )

    const response = await APIService.post<
        IMemberProfileQuickCreateRequest,
        IMemberProfile
    >(url, data)
    return response.data
}

export const createMemberProfile = async (data: IMemberProfileRequest) => {
    const url = qs.stringifyUrl(
        {
            url: BASE_ENDPOINT,
        },
        { skipNull: true }
    )

    const response = await APIService.post<
        IMemberProfileRequest,
        IMemberProfile
    >(url, data)
    return response.data
}

export const deleteMemberProfile = async (memberProfileId: TEntityId) => {
    const response = await APIService.delete<void>(
        `/member-profile/${memberProfileId}`
    )
    return response.data
}

export const getMemberProfileById = async (id: TEntityId) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}`,
    })

    const response = await APIService.get<IMemberProfile>(url)
    return response.data
}

export const updateMemberProfile = async (
    id: TEntityId,
    data: IMemberProfileRequest
) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}`,
    })

    const response = await APIService.put<
        IMemberProfileRequest,
        IMemberProfile
    >(url, data, {
        headers: {
            Authorization: `Bearer YOUR_TOKEN`, // Replace with dynamic token if applicable
        },
    })
    return response.data
}

export const closeMemberProfileAccount = async (
    id: TEntityId,
    closeRemark: IMemberCloseRemarkRequest[]
) => {
    const response = await APIService.put<
        IMemberCloseRemarkRequest[],
        IMemberProfile
    >(`/member-profile/${id}/close`, closeRemark)
    return response.data
}

export const approveMemberProfile = async (id: TEntityId) => {
    const response = await APIService.put<void, IMemberProfile>(
        `/member-profile/${id}/approve`
    )
    return response.data
}

export const declineMemberProfile = async (id: TEntityId) => {
    const response = await APIService.put<void, IMemberProfile>(
        `/member-profile/${id}/reject`
    )
    return response.data
}

export const deleteMany = async (ids: TEntityId[]) => {
    const endpoint = `${BASE_ENDPOINT}/bulk-delete`
    const payload = { ids }
    await APIService.delete<void>(endpoint, payload)
}

export const getAllMemberProfile = async () => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}`,
    })

    const response = await APIService.get<IMemberProfile[]>(url)
    return response.data
}

export const getPaginatedMemberProfile = async ({
    mode,
    sort,
    filters,
    pagination,
}: {
    mode: 'all' | 'pendings'
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    let url: string = `${BASE_ENDPOINT}`

    if (mode === 'pendings') url = '/pending'

    const finalUrl = qs.stringifyUrl(
        {
            url: `${url}/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IMemberProfilePaginated>(finalUrl)
    return response.data
}

export const getAllPendingMemberProfile = async () => {
    const response = await APIService.get<IMemberProfile[]>(
        `${BASE_ENDPOINT}/pending`
    )
    return response.data
}

export const exportAll = async () => {
    const url = `${BASE_ENDPOINT}/export`
    await downloadFileService(url, 'all_members_export.csv')
}

export const exportAllFiltered = async (filters?: string) => {
    const filterQuery = filters ? `filter=${encodeURIComponent(filters)}` : ''
    const url = `${BASE_ENDPOINT}/export-search${filterQuery ? `?${filterQuery}` : ''}`
    await downloadFileService(url, 'filtered_members_export.csv')
}

export const exportSelected = async (ids: TEntityId[]) => {
    if (ids.length === 0) {
        throw new Error('No member IDs provided for export.')
    }

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFileService(url, 'selected_members_export.csv')
}

// MEMBER PROFILE USER ACCOUNT CONNECTION

export const createMemberProfileUserAccount = async (
    memberProfileId: TEntityId,
    data: IMemberProfileUserAccountRequest
) => {
    const response = await APIService.post<
        IMemberProfileUserAccountRequest,
        IMemberProfile
    >(`/member-profile/${memberProfileId}/user-account`, data)

    return response.data
}

export const updateMemberProfileUserAccount = async (
    userId: TEntityId,
    data: IMemberProfileUserAccountRequest
) => {
    const response = await APIService.put<
        IMemberProfileUserAccountRequest,
        IMemberProfile
    >(`/member-profile/user-account/${userId}`, data)

    return response.data
}

export const connectMemberProfileToUserAccount = async (
    memberProfileId: TEntityId,
    userId: TEntityId
) => {
    const response = await APIService.put<void, IMemberProfile>(
        `/member-profile/${memberProfileId}/connect-user-account/${userId}`
    )
    return response.data
}

export const disconnectMemberProfileUserAccount = async (
    memberProfileId: TEntityId
) => {
    const response = await APIService.put<TEntityId, IMemberProfile>(
        `/member-profile/${memberProfileId}/disconnect`
    )
    return response.data
}

// FOR UPDATING

export const updateMemberProfilePersonalInfo = async (
    id: TEntityId,
    data: IMemberProfilePersonalInfoRequest
) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}/personal-info`,
    })

    const response = await APIService.put<
        IMemberProfilePersonalInfoRequest,
        IMemberProfile
    >(url, data)
    return response.data
}

export const updateMemberProfileMembershipInfo = async (
    id: TEntityId,
    data: IMemberProfileMembershipInfoRequest
) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}/membership-info`,
    })

    const response = await APIService.put<
        IMemberProfileMembershipInfoRequest,
        IMemberProfile
    >(url, data)
    return response.data
}

export const updateMemberProfileAccountInfo = async (
    id: TEntityId,
    data: IMemberProfileAccountRequest
) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}/account-info`,
    })

    const response = await APIService.put<
        IMemberProfileAccountRequest,
        IMemberProfile
    >(url, data)
    return response.data
}

export const updateMemberProfileMediasPhotoSignature = async (
    id: TEntityId,
    data: IMemberProfileMediasRequest
) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}/medias`,
    })

    const response = await APIService.put<
        IMemberProfileMediasRequest,
        IMemberProfile
    >(url, data)
    return response.data
}

// EDUCATIONAL ATTAINMENT

export const createEducationalAttainmentForMember = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>
) => {
    const url = `/member-educational-attainment/member-profile/${memberProfileId}`
    const res = await APIService.post<
        Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>,
        IMemberEducationalAttainment
    >(url, data)
    return res.data
}

export const updateEducationalAttainmentForMember = async (
    educationalAttainmentId: TEntityId,
    data: Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>
) => {
    const url = `/member-educational-attainment/${educationalAttainmentId}`
    const res = await APIService.put<
        Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>,
        IMemberEducationalAttainment
    >(url, data)
    return res.data
}

export const deleteEducationalAttainmentForMember = async (
    educationalAttainmentId: TEntityId
) => {
    const url = `/member-educational-attainment/${educationalAttainmentId}`
    await APIService.delete(url)
}

// MEMBER ADDRESS

export const createMemberProfileAddress = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberAddressRequest, 'member_profile_id'>
) => {
    const url = `/member-address/member-profile/${memberProfileId}`
    const res = await APIService.post<
        Omit<IMemberAddressRequest, 'member_profile_id'>,
        IMemberAddress
    >(url, data)
    return res.data
}

export const updateMemberProfileAddress = async (
    memberAddressId: TEntityId,
    data: Omit<IMemberAddressRequest, 'member_profile_id'>
) => {
    const url = `/member-address/${memberAddressId}`
    const res = await APIService.put<
        Omit<IMemberAddressRequest, 'member_profile_id'>,
        IMemberAddress
    >(url, data)
    return res.data
}

export const deleteMemberProfileAddress = async (
    memberAddressId: TEntityId
) => {
    const url = `/member-address/${memberAddressId}`
    await APIService.delete(url)
}

// MEMBER CONTACT REFERENCES

export const createMemberProfileContactReference = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberContactReferenceRequest, 'member_profile_id'>
) => {
    const url = `/member-contact-reference/member-profile/${memberProfileId}`
    const res = await APIService.post<
        Omit<IMemberContactReferenceRequest, 'member_profile_id'>,
        IMemberContactReference
    >(url, data)
    return res.data
}

export const updateMemberProfileContactReference = async (
    contactReferenceId: TEntityId,
    data: Omit<IMemberContactReferenceRequest, 'member_profile_id'>
) => {
    const url = `/member-contact-reference/${contactReferenceId}`
    const res = await APIService.put<
        Omit<IMemberContactReferenceRequest, 'member_profile_id'>,
        IMemberContactReference
    >(url, data)
    return res.data
}

export const deleteMemberProfileContactReference = async (
    contactReferenceId: TEntityId
) => {
    const url = `/member-contact-reference/${contactReferenceId}`
    await APIService.delete(url)
}

// MEMBER ASSET

export const createMemberProfileAsset = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberAssetRequest, 'member_profile_id'>
) => {
    const url = `/member-asset/member-profile/${memberProfileId}`
    const res = await APIService.post<
        Omit<IMemberAssetRequest, 'member_profile_id'>,
        IMemberAsset
    >(url, data)
    return res.data
}

export const updateMemberProfileAsset = async (
    assetId: TEntityId,
    data: Omit<IMemberAssetRequest, 'member_profile_id'>
) => {
    const url = `/member-asset/${assetId}`
    const res = await APIService.put<
        Omit<IMemberAssetRequest, 'member_profile_id'>,
        IMemberAsset
    >(url, data)
    return res.data
}

export const deleteMemberProfileAsset = async (assetId: TEntityId) => {
    const url = `/member-asset/${assetId}`
    await APIService.delete(url)
}

// MEMBER INCOME

export const createMemberProfileIncome = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberIncomeRequest, 'member_profile_id'>
) => {
    const url = `/member-income/member-profile/${memberProfileId}`
    const res = await APIService.post<
        Omit<IMemberIncomeRequest, 'member_profile_id'>,
        IMemberIncome
    >(url, data)
    return res.data
}

export const updateMemberProfileIncome = async (
    incomeId: TEntityId,
    data: Omit<IMemberIncomeRequest, 'member_profile_id'>
) => {
    const url = `/member-income/${incomeId}`
    const res = await APIService.put<
        Omit<IMemberIncomeRequest, 'member_profile_id'>,
        IMemberIncome
    >(url, data)
    return res.data
}

export const deleteMemberProfileIncome = async (incomeId: TEntityId) => {
    const url = `/member-income/${incomeId}`
    await APIService.delete(url)
}

// MEMBER EXPENSE

export const createMemberProfileExpense = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberExpenseRequest, 'member_profile_id'>
) => {
    const url = `/member-expense/member-profile/${memberProfileId}`
    const res = await APIService.post<
        Omit<IMemberExpenseRequest, 'member_profile_id'>,
        IMemberExpense
    >(url, data)
    return res.data
}

export const updateMemberProfileExpense = async (
    expenseId: TEntityId,
    data: Omit<IMemberExpenseRequest, 'member_profile_id'>
) => {
    const url = `/member-expense/${expenseId}`
    const res = await APIService.put<
        Omit<IMemberExpenseRequest, 'member_profile_id'>,
        IMemberExpense
    >(url, data)
    return res.data
}

export const deleteMemberProfileExpense = async (expenseId: TEntityId) => {
    const url = `/member-expense/${expenseId}`
    await APIService.delete(url)
}

// MEMBER GOVERNMENT BENEFIT

export const createMemberGovernmentBenefit = async (
    memberProfileId: TEntityId,
    data: Omit<
        IMemberGovernmentBenefitRequest,
        'member_profile_id' | 'branch_id' | 'organization_id'
    >
) => {
    const url = `/member-government-benefit/member-profile/${memberProfileId}`
    const res = await APIService.post<
        Omit<
            IMemberGovernmentBenefitRequest,
            'member_profile_id' | 'branch_id' | 'organization_id'
        >,
        IMemberGovernmentBenefit
    >(url, data)
    return res.data
}

export const updateMemberGovernmentBenefit = async (
    benefitId: TEntityId,
    data: Omit<
        IMemberGovernmentBenefitRequest,
        'member_profile_id' | 'branch_id' | 'organization_id'
    >
) => {
    const url = `/member-government-benefit/${benefitId}`
    const res = await APIService.put<
        Omit<
            IMemberGovernmentBenefitRequest,
            'member_profile_id' | 'branch_id' | 'organization_id'
        >,
        IMemberGovernmentBenefit
    >(url, data)
    return res.data
}

export const deleteMemberGovernmentBenefit = async (benefitId: TEntityId) => {
    const url = `/member-government-benefit/${benefitId}`
    await APIService.delete(url)
}

// MEMBER JOINT ACCOUNT

export const createMemberJointAccount = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberJointAccountRequest, 'member_profile_id'>
) => {
    const url = `/member-joint-account/member-profile/${memberProfileId}`
    const res = await APIService.post<
        Omit<IMemberJointAccountRequest, 'member_profile_id'>,
        IMemberJointAccount
    >(url, data)
    return res.data
}

export const updateMemberJointAccount = async (
    jointAccountId: TEntityId,
    data: Omit<IMemberJointAccountRequest, 'member_profile_id'>
) => {
    const url = `/member-joint-account/${jointAccountId}`
    const res = await APIService.put<
        Omit<IMemberJointAccountRequest, 'member_profile_id'>,
        IMemberJointAccount
    >(url, data)
    return res.data
}

export const deleteMemberJointAccount = async (jointAccountId: TEntityId) => {
    const url = `/member-joint-account/${jointAccountId}`
    await APIService.delete(url)
}

// MEMBER RELATIVE ACCOUNT

export const createMemberRelativeAccount = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberRelativeAccountRequest, 'member_profile_id'>
) => {
    const url = `/member-relative-account/member-profile/${memberProfileId}`
    const res = await APIService.post<
        Omit<IMemberRelativeAccountRequest, 'member_profile_id'>,
        IMemberRelativeAccount
    >(url, data)
    return res.data
}

export const updateMemberRelativeAccount = async (
    relativeAccountId: TEntityId,
    data: Omit<IMemberRelativeAccountRequest, 'member_profile_id'>
) => {
    const url = `/member-relative-account/${relativeAccountId}`
    const res = await APIService.put<
        Omit<IMemberRelativeAccountRequest, 'member_profile_id'>,
        IMemberRelativeAccount
    >(url, data)
    return res.data
}

export const deleteMemberRelativeAccount = async (
    relativeAccountId: TEntityId
) => {
    const url = `/member-relative-account/${relativeAccountId}`
    await APIService.delete(url)
}
