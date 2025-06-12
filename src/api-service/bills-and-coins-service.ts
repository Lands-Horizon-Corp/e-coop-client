import qs from 'query-string'

import APIService from './api-service'

import {
    TEntityId,
    IBillsAndCoin,
    IBillsAndCoinRequest,
    IBillsAndCoinPaginated,
} from '@/types'

export const createBillsCoin = async (data: IBillsAndCoinRequest) => {
    const response = await APIService.post<IBillsAndCoinRequest, IBillsAndCoin>(
        `/bills-and-coins`,
        data
    )

    return response.data
}

export const updateBillsCoin = async (
    id: TEntityId,
    data: IBillsAndCoinRequest
) => {
    const response = await APIService.post<IBillsAndCoinRequest, IBillsAndCoin>(
        `/bills-and-coins/${id}`,
        data
    )

    return response.data
}

export const getAllBillsCoins = async () => {
    const response = await APIService.get<IBillsAndCoin[]>(`/bills-and-coins`)
    return response.data
}

export const deleteBillsAndCoin = async (id: TEntityId) => {
    APIService.delete<void>(`/bills-and-coins/${id}`)
}

export const deleteManyBillsAndCoin = async (
    ids: TEntityId[]
): Promise<void> => {
    const endpoint = `/bills-and-coins/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}

export const getPaginatedBillsAndCoins = async ({
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
            url: `/bills-and-coins/search`,
            query: {
                sort,
                filter: filters,
                pageSize: pagination?.pageSize,
                pageIndex: pagination?.pageIndex,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IBillsAndCoinPaginated>(url)
    return response.data
}
