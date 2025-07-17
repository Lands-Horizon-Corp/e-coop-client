import qs from 'query-string'

import {
    IEmployee,
    IMember,
    IOwner,
    IUserOrganization,
    IUserOrganizationPaginated,
    IUserOrganizationPermissionRequest,
    TEntityId,
} from '@/types'

import APIService from './api-service'

export const deleteEmployee = async (id: TEntityId) => {
    const response = await APIService.delete<void>(`/user-organization/${id}`)
    return response.data
}

export const getAllEmployees = async () => {
    const response = await APIService.get<IUserOrganization<IEmployee>[]>(
        '/user-organization/employee'
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
            url: `/user-organization/employee/search`,
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
    let url = `/user-organization/search`

    if (mode === 'none-member-profile')
        url = '/user-organization/none-member-profle/search'

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
    await APIService.delete<void>('user-organization/bulk-delete', payload)
}

export const updateUserOrganizationPermission = async (
    userOrgId: TEntityId,
    data: IUserOrganizationPermissionRequest
) => {
    const response = await APIService.put<
        IUserOrganizationPermissionRequest,
        IUserOrganization
    >(`/user-organization/${userOrgId}/permission`, data)
    return response.data
}
