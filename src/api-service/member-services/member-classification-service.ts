import qs from 'query-string'

import APIService from '../api-service'
import { downloadFileService } from '@/helpers'

import {
    TEntityId,
    IMemberClassification,
    IMemberClassificationRequest,
    IMemberClassificationPaginated,
} from '@/types'

const BASE_ENDPOINT = '/member-classification'

export const getMemberClassificationById = async (
    id: TEntityId
): Promise<IMemberClassification> => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${id}`,
        },
        { skipNull: true }
    )

    const response = await APIService.get<IMemberClassification>(url, {
        headers: {
            Authorization: `Bearer YOUR_TOKEN`, // Replace if needed
        },
    })
    return response.data
}

export const createMemberClassification = async (
    data: IMemberClassificationRequest
): Promise<IMemberClassification> => {
    const url = qs.stringifyUrl(
        {
            url: BASE_ENDPOINT,
        },
        { skipNull: true }
    )

    const response = await APIService.post<
        IMemberClassificationRequest,
        IMemberClassification
    >(url, data)
    return response.data
}

export const updateMemberClassification = async (
    id: TEntityId,
    data: IMemberClassificationRequest
): Promise<IMemberClassification> => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${id}`,
        },
        { skipNull: true }
    )

    const response = await APIService.put<
        IMemberClassificationRequest,
        IMemberClassification
    >(url, data, {
        headers: {
            Authorization: `Bearer YOUR_TOKEN`, // Replace if needed
        },
    })
    return response.data
}

export const deleteMemberClassification = async (
    id: TEntityId
): Promise<void> => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    await APIService.delete(endpoint)
}

export const getMemberClassifications = async (): Promise<
    IMemberClassification[]
> => {
    const url = qs.stringifyUrl(
        {
            url: BASE_ENDPOINT,
        },
        { skipNull: true }
    )

    const response = await APIService.get<IMemberClassification[]>(url)
    return response.data
}

export const getPaginatedMemberClassifications = async ({
    sort,
    filters,
    pagination,
}: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
} = {}): Promise<IMemberClassificationPaginated> => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/paginated`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IMemberClassificationPaginated>(url)
    return response.data
}

export const exportAllMemberClassifications = async (): Promise<void> => {
    const url = `${BASE_ENDPOINT}/export`
    await downloadFileService(url, 'all_member_classifications_export.csv')
}

export const exportFilteredMemberClassifications = async (
    filters?: string
): Promise<void> => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/export-search`,
            query: { filters },
        },
        { skipNull: true }
    )
    await downloadFileService(url, 'filtered_member_classifications_export.csv')
}

export const exportSelectedMemberClassifications = async (
    ids: TEntityId[]
): Promise<void> => {
    if (ids.length === 0) {
        throw new Error('No member classification IDs provided for export.')
    }

    const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join('&')
    const url = `${BASE_ENDPOINT}/export-selected?${query}`

    await downloadFileService(url, 'selected_member_classifications_export.csv')
}

export const deleteManyMemberClassifications = async (
    ids: TEntityId[]
): Promise<void> => {
    const endpoint = `${BASE_ENDPOINT}/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}
