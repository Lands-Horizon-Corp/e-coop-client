import qs from 'query-string'

import APIService from './api-service'
import { downloadFile } from '../helpers'

import { IBank, TEntityId, IBankRequest, IBankPaginated } from '@/types'

const BASE_ENDPOINT = '/bank'

export const createBank = async (bankData: IBankRequest) => {
    const response = await APIService.post<IBankRequest, IBank>(
        BASE_ENDPOINT,
        bankData
    )
    return response.data
}

export const deleteBank = async (id: TEntityId) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    await APIService.delete<void>(endpoint)
}

export const updateBank = async (id: TEntityId, bankData: IBankRequest) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    const response = await APIService.put<IBankRequest, IBank>(
        endpoint,
        bankData
    )
    return response.data
}

export const getBankById = async (id: TEntityId) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${id}`,
        },
        { skipNull: true }
    )
    const response = await APIService.get<IBank>(url)
    return response.data
}

export const getAllBanks = async () => {
    const response = await APIService.get<IBank[]>(BASE_ENDPOINT)
    return response.data
}

export const getPaginatedBanks = async (props?: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IBankPaginated>(url)
    return response.data
}

export const deleteMany = async (ids: TEntityId[]) => {
    const endpoint = `${BASE_ENDPOINT}/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}

export const exportAll = async () => {
    const url = `${BASE_ENDPOINT}/export`
    await downloadFile(url, 'all_banks_export.xlsx')
}

export const exportAllFiltered = async (filters?: string) => {
    const url = `${BASE_ENDPOINT}/export-search?filter=${filters || ''}`
    await downloadFile(url, 'filtered_banks_export.xlsx')
}

export const exportSelected = async (ids: TEntityId[]) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFile(url, 'selected_banks_export.xlsx')
}
