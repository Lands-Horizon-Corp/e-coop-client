import qs from 'query-string'

import {
    IEmployee,
    IMember,
    IOwner,
    IUserOrganization,
    IUserOrganizationPaginated,
    IUserOrganizationPermissionRequest,
    IUserOrganizationSettingsRequest,
    TEntityId,
} from '@/types'

import APIService from './api-service'

export const deleteEmployee = async (id: TEntityId) => {
    const response = await APIService.delete<void>(
        `/api/v1/user-organization/${id}`
    )
    return response.data
}

export const getAllEmployees = async () => {
    const response = await APIService.get<IUserOrganization<IEmployee>[]>(
        '/api/v1/user-organization/employee'
    )
    return response.data
}

export const getPaginatedEmployees = async (props?: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/api/v1/user-organization/employee/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response =
        await APIService.get<IUserOrganizationPaginated<IEmployee>>(url)
    return response.data
}

export const getPaginatedUserOrg = async <
    T = unknown | IEmployee | IMember | IOwner,
>({
    mode = 'all',
    filters,
    pagination,
    sort,
}: {
    mode?: 'all' | 'none-member-profile'
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    let url = `/api/v1/user-organization/search`

    if (mode === 'none-member-profile')
        url = '/api/v1/user-organization/none-member-profle/search'

    const finalUrl = qs.stringifyUrl(
        {
            url,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response =
        await APIService.get<IUserOrganizationPaginated<T>>(finalUrl)
    return response.data
}

export const deleteManyEmployees = async (ids: TEntityId[]) => {
    const payload = { ids }
    await APIService.delete<void>(
        '/api/v1/user-organization/bulk-delete',
        payload
    )
}

export const updateUserOrganizationPermission = async (
    userOrgId: TEntityId,
    data: IUserOrganizationPermissionRequest
) => {
    const response = await APIService.put<
        IUserOrganizationPermissionRequest,
        IUserOrganization
    >(`/api/v1/user-organization/${userOrgId}/permission`, data)
    return response.data
}

export const updateUserOrganizationSettings = async ({
    id,
    url,
    data,
}: {
    id?: TEntityId
    url?: string
    data: IUserOrganizationSettingsRequest
}) => {
    const response = await APIService.put<
        IUserOrganizationSettingsRequest,
        IUserOrganization
    >(
        url ??
            (id
                ? `/api/v1/user-organization/settings/${id}`
                : `/api/v1/user-organization/settings/current`),
        data
    )
    return response.data
}

export const getUserOrganizationById = async (id: TEntityId) => {
    const response = await APIService.get<IUserOrganization>(
        `/api/v1/user-organization/${id}`
    )
    return response.data
}

export default {
    deleteEmployee,
    getAllEmployees,
    getPaginatedUserOrg,
    deleteManyEmployees,
    getPaginatedEmployees,
    getUserOrganizationById,
    updateUserOrganizationSettings,
    updateUserOrganizationPermission,
}
