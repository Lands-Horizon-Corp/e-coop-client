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
    url,
    sort,
    filters,
    preloads,
    pagination,
}: {
    url: string
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const finalUrl = qs.stringifyUrl(
        {
            url: `/timesheet/${url}`,
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

    const response = await APIService.get<IPaginatedTimesheet>(finalUrl)
    return response.data
}
