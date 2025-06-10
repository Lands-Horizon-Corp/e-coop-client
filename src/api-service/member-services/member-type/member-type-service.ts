// services/member-type-service.ts
import qs from 'query-string'

import APIService from '../../api-service'
import { downloadFileService } from '@/helpers'

import {
    TEntityId,
    IMemberType,
    IMemberTypeRequest,
    IMemberTypePaginated,
} from '@/types'

const BASE_ENDPOINT = '/member-type'

export const getMemberTypeById = async (
    id: TEntityId
): Promise<IMemberType> => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}`,
    })

    const response = await APIService.get<IMemberType>(url)
    return response.data
}

export const createMemberType = async (
    data: IMemberTypeRequest
): Promise<IMemberType> => {
    const url = qs.stringifyUrl(
        {
            url: BASE_ENDPOINT,
        },
        { skipNull: true }
    )

    const response = await APIService.post<IMemberTypeRequest, IMemberType>(
        url,
        data
    )
    return response.data
}

export const updateMemberType = async (
    id: TEntityId,
    data: IMemberTypeRequest
): Promise<IMemberType> => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}`,
    })

    const response = await APIService.put<IMemberTypeRequest, IMemberType>(
        url,
        data
    )
    return response.data
}

export const deleteMemberType = async (id: TEntityId) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    await APIService.delete<void>(endpoint)
}

export const getAllMemberTypes = async () => {
    const url = qs.stringifyUrl(
        {
            url: BASE_ENDPOINT,
        },
        { skipNull: true }
    )

    const response = await APIService.get<IMemberType[]>(url)
    return response.data
}

export const getPaginatedMemberTypes = async ({
    sort,
    filters,
    pagination,
}: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
} = {}): Promise<IMemberTypePaginated> => {
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

    const response = await APIService.get<IMemberTypePaginated>(url)
    return response.data
}

export const exportAllMemberTypes = async (): Promise<void> => {
    const url = `${BASE_ENDPOINT}/export`
    await downloadFileService(url, 'all_member_types_export.csv')
}

export const exportSelectedMemberTypes = async (
    ids: TEntityId[]
): Promise<void> => {
    if (ids.length === 0) {
        throw new Error('No member type IDs provided for export.')
    }

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFileService(url, 'selected_member_types_export.csv')
}

export const deleteManyMemberTypes = async (
    ids: TEntityId[]
): Promise<void> => {
    const endpoint = `${BASE_ENDPOINT}/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}
