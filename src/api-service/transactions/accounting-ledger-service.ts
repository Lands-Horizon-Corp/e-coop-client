import qs from 'query-string'

import APIService from '../api-service'

import {
    TEntityId,
    IAccountingLedgerRequest,
    IAccountingLedgerResource,
    IAccountingLedgerPaginatedResource,
} from '@/types'

export default class AccountingLedgerService {
    private static readonly BASE_ENDPOINT = '/accounting-ledger'

    private static async makeRequest<T>(
        apiCall: () => Promise<{ data: T }>
    ): Promise<T> {
        try {
            const response = await apiCall()
            return response.data
        } catch (error) {
            console.error('API Request Failed:', error)
            throw error
        }
    }

    private static buildUrl(
        endpoint: string,
        {
            filters,
            preloads,
            pagination,
            sort,
        }: {
            filters?: string
            preloads?: string[]
            pagination?: { pageIndex: number; pageSize: number }
            sort?: string
        }
    ): string {
        return qs.stringify(
            {
                url: `${this.BASE_ENDPOINT}${endpoint}`,
                query: {
                    sort,
                    preloads,
                    filters,
                    pageIndex: pagination?.pageIndex,
                    pageSize: pagination?.pageSize,
                },
            },
            { skipNull: true, skipEmptyString: true }
        )
    }

    public static async create(
        ledgerData: IAccountingLedgerRequest,
        preloads?: string[]
    ): Promise<IAccountingLedgerResource> {
        const url = this.buildUrl('', { preloads })
        return this.makeRequest(() =>
            APIService.post<
                IAccountingLedgerRequest,
                IAccountingLedgerResource
            >(url, ledgerData)
        )
    }

    public static async getLedgers({
        sort,
        filters,
        preloads,
        pagination,
    }: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    }) {
        const url = this.buildUrl('', { filters, preloads, pagination, sort })
        return this.makeRequest(() =>
            APIService.get<IAccountingLedgerPaginatedResource>(url)
        )
    }

    public static async getLedgerByMemberId(memberId: TEntityId) {
        const url = qs.stringifyUrl({
            url: `${this.BASE_ENDPOINT}/member/${memberId}`,
        })

        return APIService.get<IAccountingLedgerResource>(url).then(
            (response) => response.data
        )
    }
}
