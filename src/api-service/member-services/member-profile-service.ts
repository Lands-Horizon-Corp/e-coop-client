import qs from 'query-string'

import APIService from '../api-service'
import { downloadFileService } from '@/helpers'

import {
    TEntityId,
    IMemberAsset,
    IMemberIncome,
    IMemberExpense,
    IMemberAddress,
    IMemberProfile,
    IMemberJointAccount,
    IMemberAssetRequest,
    IMemberIncomeRequest,
    IMemberExpenseRequest,
    IMemberProfileRequest,
    IMemberAddressRequest,
    IMemberRelativeAccount,
    IMemberProfilePaginated,
    IMemberContactReference,
    IMemberGovernmentBenefit,
    IMemberCloseRemarkRequest,
    IMemberJointAccountRequest,
    IMemberProfileMediasRequest,
    IMemberEducationalAttainment,
    IMemberProfileAccountRequest,
    IMemberRelativeAccountRequest,
    IMemberContactReferenceRequest,
    IMemberGovernmentBenefitRequest,
    IMemberProfileQuickCreateRequest,
    IMemberProfilePersonalInfoRequest,
    IMemberProfileMembershipInfoRequest,
    IMemberEducationalAttainmentRequest,
} from '@/types'

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
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}/close-account`,
    })

    const response = await APIService.put<
        IMemberCloseRemarkRequest[],
        IMemberProfile
    >(url, closeRemark, {
        headers: {
            Authorization: `Bearer YOUR_TOKEN`, // Replace with dynamic token if applicable
        },
    })
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
        `/member-profile/${id}/decline`
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
            url: `${url}/paginated`,
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
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/educational-attainment`
    const res = await APIService.post<
        Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>,
        IMemberEducationalAttainment
    >(url, data)
    return res.data
}

export const updateEducationalAttainmentForMember = async (
    memberProfileId: TEntityId,
    educationalAttainmentId: TEntityId,
    data: Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/educational-attainment/${educationalAttainmentId}`
    const res = await APIService.put<
        Omit<IMemberEducationalAttainmentRequest, 'member_profile_id'>,
        IMemberEducationalAttainment
    >(url, data)
    return res.data
}

export const deleteEducationalAttainmentForMember = async (
    memberProfileId: TEntityId,
    educationalAttainmentId: TEntityId
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/educational-attainment/${educationalAttainmentId}`
    return APIService.delete(url)
}

// MEMBER ADDRESS

export const createMemberProfileAddress = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberAddressRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/address`
    const res = await APIService.post<
        Omit<IMemberAddressRequest, 'member_profile_id'>,
        IMemberAddress
    >(url, data)
    return res.data
}

export const updateMemberProfileAddress = async (
    memberProfileId: TEntityId,
    memberAddressId: TEntityId,
    data: Omit<IMemberAddressRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/address/${memberAddressId}`
    const res = await APIService.put<
        Omit<IMemberAddressRequest, 'member_profile_id'>,
        IMemberAddress
    >(url, data)
    return res.data
}

export const deleteMemberProfileAddress = async (
    memberProfileId: TEntityId,
    memberAddressId: TEntityId
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/address/${memberAddressId}`
    return APIService.delete(url)
}

// MEMBER CONTACT REFERENCES

export const createMemberProfileContactReference = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberContactReferenceRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/contact-reference`
    const res = await APIService.post<
        Omit<IMemberContactReferenceRequest, 'member_profile_id'>,
        IMemberContactReference
    >(url, data)
    return res.data
}

export const updateMemberProfileContactReference = async (
    memberProfileId: TEntityId,
    contactReferenceId: TEntityId,
    data: Omit<IMemberContactReferenceRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/contact-reference/${contactReferenceId}`
    const res = await APIService.put<
        Omit<IMemberContactReferenceRequest, 'member_profile_id'>,
        IMemberContactReference
    >(url, data)
    return res.data
}

export const deleteMemberProfileContactReference = async (
    memberProfileId: TEntityId,
    contactReferenceId: TEntityId
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/contact-reference/${contactReferenceId}`
    return APIService.delete(url)
}

// MEMBER ASSET

export const createMemberProfileAsset = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberAssetRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/asset`
    const res = await APIService.post<
        Omit<IMemberAssetRequest, 'member_profile_id'>,
        IMemberAsset
    >(url, data)
    return res.data
}

export const updateMemberProfileAsset = async (
    memberProfileId: TEntityId,
    assetId: TEntityId,
    data: Omit<IMemberAssetRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/asset/${assetId}`
    const res = await APIService.put<
        Omit<IMemberAssetRequest, 'member_profile_id'>,
        IMemberAsset
    >(url, data)
    return res.data
}

export const deleteMemberProfileAsset = async (
    memberProfileId: TEntityId,
    assetId: TEntityId
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/asset/${assetId}`
    return APIService.delete(url)
}

// MEMBER INCOME

export const createMemberProfileIncome = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberIncomeRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/income`
    const res = await APIService.post<
        Omit<IMemberIncomeRequest, 'member_profile_id'>,
        IMemberIncome
    >(url, data)
    return res.data
}

export const updateMemberProfileIncome = async (
    memberProfileId: TEntityId,
    incomeId: TEntityId,
    data: Omit<IMemberIncomeRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/income/${incomeId}`
    const res = await APIService.put<
        Omit<IMemberIncomeRequest, 'member_profile_id'>,
        IMemberIncome
    >(url, data)
    return res.data
}

export const deleteMemberProfileIncome = async (
    memberProfileId: TEntityId,
    incomeId: TEntityId
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/income/${incomeId}`
    return APIService.delete(url)
}

// MEMBER EXPENSE

export const createMemberProfileExpense = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberExpenseRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/expense`
    const res = await APIService.post<
        Omit<IMemberExpenseRequest, 'member_profile_id'>,
        IMemberExpense
    >(url, data)
    return res.data
}

export const updateMemberProfileExpense = async (
    memberProfileId: TEntityId,
    expenseId: TEntityId,
    data: Omit<IMemberExpenseRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/expense/${expenseId}`
    const res = await APIService.put<
        Omit<IMemberExpenseRequest, 'member_profile_id'>,
        IMemberExpense
    >(url, data)
    return res.data
}

export const deleteMemberProfileExpense = async (
    memberProfileId: TEntityId,
    expenseId: TEntityId
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/expense/${expenseId}`
    return APIService.delete(url)
}

// MEMBER GOVERNMENT BENEFIT

export const createMemberGovernmentBenefit = async (
    memberProfileId: TEntityId,
    data: Omit<
        IMemberGovernmentBenefitRequest,
        'member_profile_id' | 'branch_id' | 'organization_id'
    >
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/government-benefit`
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
    memberProfileId: TEntityId,
    benefitId: TEntityId,
    data: Omit<
        IMemberGovernmentBenefitRequest,
        'member_profile_id' | 'branch_id' | 'organization_id'
    >
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/government-benefit/${benefitId}`
    const res = await APIService.put<
        Omit<
            IMemberGovernmentBenefitRequest,
            'member_profile_id' | 'branch_id' | 'organization_id'
        >,
        IMemberGovernmentBenefit
    >(url, data)
    return res.data
}

export const deleteMemberGovernmentBenefit = async (
    memberProfileId: TEntityId,
    benefitId: TEntityId
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/government-benefit/${benefitId}`
    return APIService.delete(url)
}

// MEMBER JOINT ACCOUNT

export const createMemberJointAccount = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberJointAccountRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/joint-account`
    const res = await APIService.post<
        Omit<IMemberJointAccountRequest, 'member_profile_id'>,
        IMemberJointAccount
    >(url, data)
    return res.data
}

export const updateMemberJointAccount = async (
    memberProfileId: TEntityId,
    jointAccountId: TEntityId,
    data: Omit<IMemberJointAccountRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/joint-account/${jointAccountId}`
    const res = await APIService.put<
        Omit<IMemberJointAccountRequest, 'member_profile_id'>,
        IMemberJointAccount
    >(url, data)
    return res.data
}

export const deleteMemberJointAccount = async (
    memberProfileId: TEntityId,
    jointAccountId: TEntityId
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/joint-account/${jointAccountId}`
    return APIService.delete(url)
}

// MEMBER RELATIVE ACCOUNT

export const createMemberRelativeAccount = async (
    memberProfileId: TEntityId,
    data: Omit<IMemberRelativeAccountRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/relative-account`
    const res = await APIService.post<
        Omit<IMemberRelativeAccountRequest, 'member_profile_id'>,
        IMemberRelativeAccount
    >(url, data)
    return res.data
}

export const updateMemberRelativeAccount = async (
    memberProfileId: TEntityId,
    relativeAccountId: TEntityId,
    data: Omit<IMemberRelativeAccountRequest, 'member_profile_id'>
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/relative-account/${relativeAccountId}`
    const res = await APIService.put<
        Omit<IMemberRelativeAccountRequest, 'member_profile_id'>,
        IMemberRelativeAccount
    >(url, data)
    return res.data
}

export const deleteMemberRelativeAccount = async (
    memberProfileId: TEntityId,
    relativeAccountId: TEntityId
) => {
    const url = `/${BASE_ENDPOINT}/${memberProfileId}/relative-account/${relativeAccountId}`
    return APIService.delete(url)
}
