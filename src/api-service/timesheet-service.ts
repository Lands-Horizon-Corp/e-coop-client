import qs from 'query-string'

import {
    IPaginatedTimesheet,
    ITimesheet,
    ITimesheetInOutRequest,
    TEntityId,
} from '@/types'

import APIService from './api-service'

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
    pagination,
}: {
    url: string
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const finalUrl = qs.stringifyUrl(
        {
            url: `/timesheet/${url}`,
            query: {
                sort,
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
