import qs from 'query-string'

import APIService from './api-service'

import {
    TEntityId,
    IEmployee,
    IUserOrganization,
    IUserOrganizationPaginated,
    IMember,
    IOwner,
} from '@/types'

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
>(props?: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/user-organization/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IUserOrganizationPaginated<T>>(url)
    return response.data
}

export const deleteManyEmployees = async (ids: TEntityId[]) => {
    const payload = { ids }
    await APIService.delete<void>('user-organization/bulk-delete', payload)
}
