import qs from 'query-string'

import APIService from './api-service'

import {
    TEntityId,
    IHoliday,
    IHolidayRequest,
    IHolidayPaginated,
} from '@/types'

export const getHolidayById = async (id: TEntityId) => {
    const response = await APIService.get<IHoliday>(`/holidays/${id}`)
    return response.data
}

export const createHoliday = async (data: IHolidayRequest) => {
    const response = await APIService.post<IHolidayRequest, IHoliday>(
        '/holidays',
        data
    )

    return response.data
}

export const updateHoliday = async (id: TEntityId, data: IHolidayRequest) => {
    const response = await APIService.put<IHolidayRequest, IHoliday>(
        `/holidays/${id}`,
        data
    )

    return response.data
}

export const deleteHoliday = async (id: TEntityId) => {
    const response = await APIService.delete<void>(`/holidays/${id}`)

    return response.data
}

export const deleteManyHolidays = async (ids: TEntityId[]) => {
    const endpoint = `/holidays/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}

export const getAllHolidays = async () => {
    const response = await APIService.get<IHoliday[]>('/holidays')
    return response.data
}

export const getPaginatedHolidays = async ({
    sort,
    preloads,
    filters,
    pagination,
}: {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
} = {}) => {
    const url = qs.stringifyUrl(
        {
            url: `holidays/paginated`,
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

    const response = await APIService.get<IHolidayPaginated>(url)
    return response.data
}
