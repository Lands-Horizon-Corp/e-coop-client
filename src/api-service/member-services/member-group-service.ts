import qs from 'query-string'
import APIService from '../api-service'
import { downloadFileService } from '@/helpers'

import {
    TEntityId,
    IMemberGroup,
    IMemberGroupRequest,
    IMemberGroupPaginated,
} from '@/types'

const BASE_ENDPOINT = '/member-group'

export const getAllMemberGroups = async () => {
    const response = await APIService.get<IMemberGroup[]>(BASE_ENDPOINT)
    return response.data
}

export const createMemberGroup = async (groupData: IMemberGroupRequest) => {
    const response = await APIService.post<IMemberGroupRequest, IMemberGroup>(
        BASE_ENDPOINT,
        groupData
    )
    return response.data
}

export const deleteMemberGroup = async (id: TEntityId) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    await APIService.delete<void>(endpoint)
}

export const updateMemberGroup = async (
    id: TEntityId,
    groupData: IMemberGroupRequest
) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    const response = await APIService.put<IMemberGroupRequest, IMemberGroup>(
        endpoint,
        groupData
    )
    return response.data
}

export const getMemberGroupById = async (id: TEntityId) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${id}`,
        },
        { skipNull: true }
    )
    const response = await APIService.get<IMemberGroup>(url)
    return response.data
}

export const getPaginatedMemberGroups = async (props?: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

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

    const response = await APIService.get<IMemberGroupPaginated>(url)
    return response.data
}

export const deleteMany = async (ids: TEntityId[]) => {
    const endpoint = `${BASE_ENDPOINT}/bulk-delete`
    const payload = { ids }
    await APIService.delete<void>(endpoint, payload)
}

export const exportAll = async () => {
    const url = `${BASE_ENDPOINT}/export`
    await downloadFileService(url, 'all_groups_export.xlsx')
}

export const exportAllFiltered = async (filters?: string) => {
    const url = `${BASE_ENDPOINT}/export-search?filter=${filters || ''}`
    await downloadFileService(url, 'filtered_groups_export.xlsx')
}

export const exportSelected = async (ids: TEntityId[]) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFileService(url, 'selected_groups_export.xlsx')
}

export const exportCurrentPage = async (page: number) => {
    const url = `${BASE_ENDPOINT}/export-current-page/${page}`
    await downloadFileService(url, `current_page_groups_${page}_export.xlsx`)
}
