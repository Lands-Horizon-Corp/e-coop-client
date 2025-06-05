import qs from 'query-string'

import APIService from './api-service'

import {
    TEntityId,
    ITimesheet,
    IPaginatedTimesheet,
    ITimesheetInOutRequest,
} from '@/types'

export const getTimesheetById = async (id: TEntityId) => {
    const response = await APIService.get<ITimesheet>(`/timesheet/${id}`)
    return response.data
}

export const getCurrentTimesheet = async () => {
    const response = await APIService.get<ITimesheet>('/timesheet/current')
    return response.data
}

export const timeInOut = async (data: ITimesheetInOutRequest) => {
    const response = await APIService.post<ITimesheetInOutRequest, ITimesheet>(
        '/timesheet/time-in-and-out',
        data
    )
    return response.data
}

export const getPaginatedTimesheets = async ({
    sort,
    filters,
    preloads,
    pagination,
}: {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
} = {}) => {
    const url = qs.stringifyUrl(
        {
            url: `/timesheet`,
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

    const response = await APIService.get<IPaginatedTimesheet>(url)
    return response.data
}

export const getMyPaginatedTimesheets = async ({
    sort,
    filters,
    preloads,
    pagination,
}: {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
} = {}) => {
    const url = qs.stringifyUrl(
        {
            url: `/timesheet/me`,
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

    const response = await APIService.get<IPaginatedTimesheet>(url)
    return response.data
}

export const getUserPaginatedTimesheets = async ({
    userId,
    sort,
    filters,
    preloads,
    pagination,
}: {
    userId: TEntityId
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const url = qs.stringifyUrl(
        {
            url: `/timesheet/user/${userId}`,
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

    const response = await APIService.get<IPaginatedTimesheet>(url)
    return response.data
}
