import qs from 'query-string'

import APIService from './api-service'

import {
    TEntityId,
    IEmployee,
    IUserOrganization,
    IUserOrganizationPaginated,
} from '@/types'

export const deleteEmployee = async (id: TEntityId) => {
    const response = await APIService.delete<void>(
        `/user-organization/employee/${id}`
    )
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
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/user-organization/employee/paginated`,
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

    const response =
        await APIService.get<IUserOrganizationPaginated<IEmployee>>(url)
    return response.data
}

export const deleteManyEmployees = async (ids: TEntityId[]) => {
    const payload = { ids }
    await APIService.delete<void>(
        'user-organization/employee/bulk-delete',
        payload
    )
}
