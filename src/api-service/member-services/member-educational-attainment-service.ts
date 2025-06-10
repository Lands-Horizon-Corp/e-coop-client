import qs from 'query-string'

import APIService from '../api-service'
import { downloadFileService } from '@/helpers'

import {
    TEntityId,
    IMemberEducationalAttainment,
    IMemberEducationalAttainmentRequest,
    IMemberEducationalAttainmentPaginated,
} from '@/types'

const BASE_ENDPOINT = '/member-educational-attainment'

export const getMemberEducationalAttainmentById = async (id: TEntityId) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${id}`,
        },
        { skipNull: true }
    )

    const res = await APIService.get<IMemberEducationalAttainment>(url, {
        headers: {
            Authorization: `Bearer YOUR_TOKEN`,
        },
    })
    return res.data
}

export const createMemberEducationalAttainment = async (
    data: IMemberEducationalAttainmentRequest
) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}`,
        },
        { skipNull: true }
    )

    const res = await APIService.post<
        IMemberEducationalAttainmentRequest,
        IMemberEducationalAttainment
    >(url, data)
    return res.data
}

export const updateMemberEducationalAttainment = async (
    id: TEntityId,
    data: IMemberEducationalAttainmentRequest
) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${id}`,
        },
        { skipNull: true }
    )

    const res = await APIService.put<
        IMemberEducationalAttainmentRequest,
        IMemberEducationalAttainment
    >(url, data, {
        headers: {
            Authorization: `Bearer YOUR_TOKEN`,
        },
    })
    return res.data
}

export const deleteMemberEducationalAttainment = async (id: TEntityId) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    return APIService.delete(endpoint)
}

export const getMemberEducationalAttainments = async ({
    filters,
    pagination,
    sort,
}: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
} = {}) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const res = await APIService.get<IMemberEducationalAttainmentPaginated>(url)
    return res.data
}

export const exportAllMemberEducationalAttainments = async () => {
    const url = `${BASE_ENDPOINT}/export`
    return downloadFileService(
        url,
        'all_member_educational_attainments_export.csv'
    )
}

export const exportAllFilteredMemberEducationalAttainments = async (
    filters?: string
) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/export-search`,
            query: { filters },
        },
        { skipNull: true }
    )
    return downloadFileService(
        url,
        'filtered_member_educational_attainments_export.csv'
    )
}

export const exportSelectedMemberEducationalAttainments = async (
    ids: TEntityId[]
) => {
    if (ids.length === 0) {
        throw new Error(
            'No member educational attainment IDs provided for export.'
        )
    }
    const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join('&')
    const url = `${BASE_ENDPOINT}/export-selected?${query}`
    return downloadFileService(
        url,
        'selected_member_educational_attainments_export.csv'
    )
}

export const deleteManyMemberEducationalAttainments = async (
    ids: TEntityId[]
) => {
    const endpoint = `${BASE_ENDPOINT}/bulk-delete`
    const payload = { ids }
    return APIService.delete<void>(endpoint, payload)
}
