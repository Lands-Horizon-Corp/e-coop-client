import qs from 'query-string'

import APIService from './api-service'
import { downloadFileService } from '@/helpers'
import {
    TEntityId,
    IBankRequest,
    IBankResponse,
    IBankPaginatedResource,
} from '@/types'

export default class BankService {
    private static readonly BASE_ENDPOINT = '/bank'

    public static async getAll(): Promise<IBankResponse[]> {
        const response = await APIService.get<IBankResponse[]>(
            BankService.BASE_ENDPOINT
        )
        return response.data
    }

    public static async create(bankData: IBankRequest): Promise<IBankResponse> {
        const response = await APIService.post<IBankRequest, IBankResponse>(
            BankService.BASE_ENDPOINT,
            bankData
        )
        return response.data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${BankService.BASE_ENDPOINT}/${id}`
        await APIService.delete<void>(endpoint)
    }

    public static async update(
        id: TEntityId,
        bankData: IBankRequest
    ): Promise<IBankResponse> {
        const endpoint = `${BankService.BASE_ENDPOINT}/${id}`
        const response = await APIService.put<IBankRequest, IBankResponse>(
            endpoint,
            bankData
        )
        return response.data
    }

    public static async getById(id: TEntityId): Promise<IBankResponse> {
        const url = qs.stringifyUrl(
            {
                url: `${BankService.BASE_ENDPOINT}/${id}`,
            },
            { skipNull: true }
        )
        const response = await APIService.get<IBankResponse>(url)
        return response.data
    }

    public static async getBanks(props?: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    }): Promise<IBankPaginatedResource> {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${BankService.BASE_ENDPOINT}/search`,
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

        const response = await APIService.get<IBankPaginatedResource>(url)
        return response.data
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const endpoint = `${BankService.BASE_ENDPOINT}/bulk-delete`
        await APIService.delete<void>(endpoint, { ids })
    }

    public static async exportAll(): Promise<void> {
        const url = `${BankService.BASE_ENDPOINT}/export`
        await downloadFileService(url, 'all_banks_export.xlsx')
    }

    public static async exportAllFiltered(filters?: string): Promise<void> {
        const url = `${BankService.BASE_ENDPOINT}/export-search?filter=${filters || ''}`
        await downloadFileService(url, 'filtered_banks_export.xlsx')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        const url = qs.stringifyUrl(
            {
                url: `${BankService.BASE_ENDPOINT}/export-selected`,
                query: { ids },
            },
            { skipNull: true }
        )

        await downloadFileService(url, 'selected_banks_export.xlsx')
    }

    public static async exportCurrentPage(page: number): Promise<void> {
        const url = `${BankService.BASE_ENDPOINT}/export-current-page/${page}`
        await downloadFileService(url, `current_page_banks_${page}_export.xlsx`)
    }
}
