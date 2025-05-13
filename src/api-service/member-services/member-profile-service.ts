import qs from 'query-string'
import APIService from '../api-service'

import {
    TEntityId,
    IMemberProfile,
    IMemberProfileRequest,
    IMemberProfilePaginated,
    IMemberCloseRemarkRequest,
    IMemberProfileQuickCreateRequest,
} from '@/types'
import { downloadFileService } from '@/helpers'

const BASE_ENDPOINT = '/member-profile'

export const quickCreateMemberProfile = async (
    data: IMemberProfileQuickCreateRequest,
    preloads?: string[]
) => {
    const url = qs.stringifyUrl(
        {
            url: BASE_ENDPOINT,
            query: { preloads },
        },
        { skipNull: true }
    )

    const response = await APIService.post<
        IMemberProfileQuickCreateRequest,
        IMemberProfile
    >(url, data)
    return response.data
}

export const createMemberProfile = async (
    data: IMemberProfileRequest,
    preloads?: string[]
) => {
    const url = qs.stringifyUrl(
        {
            url: BASE_ENDPOINT,
            query: { preloads },
        },
        { skipNull: true }
    )

    const response = await APIService.post<
        IMemberProfileRequest,
        IMemberProfile
    >(url, data)
    return response.data
}

export const getMemberProfileById = async (
    id: TEntityId,
    preloads?: string[]
) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}`,
        query: { preloads },
    })

    const response = await APIService.get<IMemberProfile>(url)
    return response.data
}

export const updateMemberProfile = async (
    id: TEntityId,
    data: IMemberProfileRequest,
    preloads?: string[]
) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}`,
        query: { preloads },
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
    closeRemark: IMemberCloseRemarkRequest[],
    preloads?: string[]
) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}/close-account`,
        query: { preloads },
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

export const deleteMany = async (ids: TEntityId[]) => {
    const endpoint = `${BASE_ENDPOINT}/bulk-delete`
    const payload = { ids }
    await APIService.delete<void>(endpoint, payload)
}

export const getAllMemberProfile = async (preloads?: string[]) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}`,
        query: { preloads },
    })

    const response = await APIService.get<IMemberProfile[]>(url)
    return response.data
}

export const getPaginatedMemberProfile = async ({
    filters,
    preloads,
    pagination,
    sort,
}: {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
} = {}) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/paginated`,
            query: {
                sort,
                preloads,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IMemberProfilePaginated>(url)
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
