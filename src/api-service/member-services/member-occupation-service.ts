import qs from 'query-string'

import APIService from '../api-service'
import { downloadFileService } from '@/helpers'

import {
    TEntityId,
    IMemberOccupation,
    IMemberOccupationRequest,
    IMemberOccupationPaginated,
} from '@/types'

const BASE_ENDPOINT = '/member-occupation'

export const getMemberOccupationById = async (id: TEntityId) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${id}`,
        },
        { skipNull: true }
    )

    const response = await APIService.get<IMemberOccupation>(url, {
        headers: {
            Authorization: `Bearer YOUR_TOKEN`,
        },
    })

    return response.data
}

export const createMemberOccupation = async (
    data: IMemberOccupationRequest
) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}`,
        },
        { skipNull: true }
    )

    const response = await APIService.post<
        IMemberOccupationRequest,
        IMemberOccupation
    >(url, data)
    return response.data
}

export const updateMemberOccupation = async (
    id: TEntityId,
    data: IMemberOccupationRequest
) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${id}`,
        },
        { skipNull: true }
    )

    const response = await APIService.put<
        IMemberOccupationRequest,
        IMemberOccupation
    >(url, data, {
        headers: {
            Authorization: `Bearer YOUR_TOKEN`,
        },
    })
    return response.data
}

export const removeMemberOccupation = async (id: TEntityId) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    await APIService.delete(endpoint)
}

export const getAllMemberOccupation = async () => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}`,
        },
        { skipNull: true }
    )

    const response = await APIService.get<IMemberOccupation[]>(url)
    return response.data
}

export const getPaginatedMemberOccupation = async ({
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
            url: `${BASE_ENDPOINT}/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IMemberOccupationPaginated>(url)
    return response.data
}

export const exportAllMemberOccupation = async () => {
    const url = `${BASE_ENDPOINT}/export`
    await downloadFileService(url, 'all_member_occupations_export.csv')
}

export const exportAllFilteredMemberOccupation = async (filters?: string) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/export-search`,
            query: { filters },
        },
        { skipNull: true }
    )
    await downloadFileService(url, 'filtered_member_occupations_export.csv')
}

export const exportSelectedMemberOccupation = async (ids: TEntityId[]) => {
    if (ids.length === 0) {
        throw new Error('No member occupation IDs provided for export.')
    }
    const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join('&')
    const url = `${BASE_ENDPOINT}/export-selected?${query}`
    await downloadFileService(url, 'selected_member_occupations_export.csv')
}

export const deleteManyMemberOccupation = async (ids: TEntityId[]) => {
    const endpoint = `${BASE_ENDPOINT}/bulk-delete`
    const payload = { ids }
    await APIService.delete<void>(endpoint, payload)
}
