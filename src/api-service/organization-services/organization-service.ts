import qs from 'query-string'

import { downloadFileService } from '@/helpers'
import APIService from '@/api-service/api-service'

import {
    TEntityId,
    IOrganization,
    IOrganizationRequest,
    IOrganizationPaginated,
    ICreateOrganizationResponse,
} from '@/types'

export const getAllOrganizations = async () => {
    const response = await APIService.get<IOrganization[]>(`/organization`)
    return response.data
}
export const getOrganizationUserId = async (userId: TEntityId) => {
    const response = await APIService.get<IOrganization>(
        `/organization/${userId}`
    )
    return response.data
}

export const getOrganizationById = async (id: TEntityId) => {
    const response = await APIService.get<IOrganization>(`/organization/${id}`)
    return response.data
}

export const createOrganization = async (
    organizationData: IOrganizationRequest
) => {
    const response = await APIService.post<
        IOrganizationRequest,
        ICreateOrganizationResponse
    >(`/organization`, organizationData)
    return response.data
}

export const updateOrganization = async (
    id: TEntityId,
    data: IOrganizationRequest
) => {
    const url = qs.stringifyUrl(
        {
            url: `/organization/${id}`,
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
    const endpoint = `/organization/${id}`
    await APIService.delete<void>(endpoint)
}

export const deleteManyOrganizations = async (ids: TEntityId[]) => {
    const endpoint = `/organization/bulk-delete`
    const payload = { ids }
    await APIService.delete<void>(endpoint, payload)
}

export const getPaginatedOrganizations = async (props?: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/organization/search`,
            query: {
                sort,
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
    const url = `/organization/export`
    await downloadFileService(url, 'all_organizations_export.xlsx')
}

export const exportFilteredOrganizations = async (filters?: string) => {
    const url = `/organization/export-search?filter=${filters || ''}`
    await downloadFileService(url, 'filtered_organizations_export.xlsx')
}

export const exportSelectedOrganizations = async (ids: TEntityId[]) => {
    const url = qs.stringifyUrl(
        {
            url: `/organization/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFileService(url, 'selected_organizations_export.xlsx')
}

export const exportCurrentPageOrganizations = async (page: number) => {
    const url = `/organization/export-current-page/${page}`
    await downloadFileService(
        url,
        `current_page_organizations_${page}_export.xlsx`
    )
}
