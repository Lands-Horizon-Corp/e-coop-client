// services/member-center-service.ts
import qs from 'query-string'

import APIService from '../api-service'
import { downloadFileService } from '@/helpers'

import {
    TEntityId,
    IMemberCenter,
    IMemberCenterRequest,
    IMemberCenterPaginated,
} from '@/types'

const BASE_ENDPOINT = '/member-type'

export const getMemberCenterById = async (
    id: TEntityId,
    preloads?: string[]
) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}`,
        query: { preloads },
    })

    const response = await APIService.get<IMemberCenter>(url)
    return response.data
}

export const createMemberCenter = async (
    data: IMemberCenterRequest,
    preloads?: string[]
) => {
    const url = qs.stringifyUrl(
        {
            url: BASE_ENDPOINT,
            query: { preloads },
        },
        { skipNull: true }
    )

    const response = await APIService.post<IMemberCenterRequest, IMemberCenter>(
        url,
        data
    )
    return response.data
}

export const deleteMemberCenter = async (id: TEntityId) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    await APIService.delete<void>(endpoint)
}

export const updateMemberCenter = async (
    id: TEntityId,
    data: IMemberCenterRequest,
    preloads?: string[]
) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}`,
        query: { preloads },
    })

    const response = await APIService.put<IMemberCenterRequest, IMemberCenter>(
        url,
        data
    )
    return response.data
}

export const getAllMemberCenters = async (preloads?: string[]) => {
    const url = qs.stringifyUrl(
        {
            url: BASE_ENDPOINT,
            query: { preloads },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IMemberCenter[]>(url)
    return response.data
}

export const getPaginatedMemberCenters = async (props?: {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, preloads, pagination, sort } = props || {}

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

    const response = await APIService.get<IMemberCenterPaginated>(url)
    return response.data
}

export const exportAllMemberCenters = async () => {
    const url = `${BASE_ENDPOINT}/export`
    await downloadFileService(url, 'all_member_types_export.csv')
}

export const exportSelectedMemberCenters = async (ids: TEntityId[]) => {
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

export const deleteManyMemberCenters = async (ids: TEntityId[]) => {
    const endpoint = `${BASE_ENDPOINT}/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}
