import qs from 'query-string'

import APIService from './api-service'

import {
    IHoliday,
    TEntityId,
    IHolidayRequest,
    IHolidayPaginated,
} from '@/types'

export const getHolidayById = async (id: TEntityId) => {
    const response = await APIService.get<IHoliday>(`/holidays/${id}`)
    return response.data
}

export const createHoliday = async (data: IHolidayRequest) => {
    const response = await APIService.post<IHolidayRequest, IHoliday>(
        '/holiday',
        data
    )

    return response.data
}

export const updateHoliday = async (id: TEntityId, data: IHolidayRequest) => {
    const response = await APIService.put<IHolidayRequest, IHoliday>(
        `/holiday/${id}`,
        data
    )

    return response.data
}

export const deleteHoliday = async (id: TEntityId) => {
    const response = await APIService.delete<void>(`/holiday/${id}`)

    return response.data
}

export const deleteManyHolidays = async (ids: TEntityId[]) => {
    const endpoint = `/holiday/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}

export const getAllHolidays = async () => {
    const response = await APIService.get<IHoliday[]>('/holiday')
    return response.data
}

export const getPaginatedHolidays = async ({
    sort,
    filters,
    pagination,
}: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
} = {}) => {
    const url = qs.stringifyUrl(
        {
            url: `holiday/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IHolidayPaginated>(url)
    return response.data
}
