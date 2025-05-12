// services/organization-service.ts
import qs from 'query-string'

import { downloadFileService } from '@/helpers'
import APIService from '@/api-service/api-service'

import {
    TEntityId,
    IOrganization,
    IOrganizationRequest,
    IOrganizationPaginated,
} from '@/types'

const BASE_ENDPOINT = '/organization'

export const getAllOrganizations = async () => {
    const response = await APIService.get<IOrganization[]>(BASE_ENDPOINT)
    return response.data
}

export const getOrganizationById = async (
    id: TEntityId,
    preloads?: string[]
) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${id}`,
            query: { preloads },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IOrganization>(url)
    return response.data
}

export const createOrganization = async (
    data: IOrganizationRequest,
    preloads?: string[]
) => {
    const url = qs.stringifyUrl(
        {
            url: BASE_ENDPOINT,
            query: { preloads },
        },
        { skipNull: true }
    )

    const response = await APIService.post<IOrganizationRequest, IOrganization>(
        url,
        data
    )
    return response.data
}

export const updateOrganization = async (
    id: TEntityId,
    data: IOrganizationRequest,
    preloads?: string[]
) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${id}`,
            query: { preloads },
        },
        { skipNull: true }
    )

    const response = await APIService.put<IOrganizationRequest, IOrganization>(
        url,
        data
    )
    return response.data
}

export const deleteOrganization = async (id: TEntityId) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    await APIService.delete<void>(endpoint)
}

export const deleteManyOrganizations = async (ids: TEntityId[]) => {
    const endpoint = `${BASE_ENDPOINT}/bulk-delete`
    const payload = { ids }
    await APIService.delete<void>(endpoint, payload)
}

export const getPaginatedOrganizations = async (props?: {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/search`,
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

    const response = await APIService.get<IOrganizationPaginated>(url)
    return response.data
}

export const exportAllOrganizations = async () => {
    const url = `${BASE_ENDPOINT}/export`
    await downloadFileService(url, 'all_organizations_export.xlsx')
}

export const exportFilteredOrganizations = async (filters?: string) => {
    const url = `${BASE_ENDPOINT}/export-search?filter=${filters || ''}`
    await downloadFileService(url, 'filtered_organizations_export.xlsx')
}

export const exportSelectedOrganizations = async (ids: TEntityId[]) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFileService(url, 'selected_organizations_export.xlsx')
}

export const exportCurrentPageOrganizations = async (page: number) => {
    const url = `${BASE_ENDPOINT}/export-current-page/${page}`
    await downloadFileService(
        url,
        `current_page_organizations_${page}_export.xlsx`
    )
}
