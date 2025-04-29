import {
    TEntityId,
    IAccountsRequest,
    IAccountsResource,
    IAccountsPaginatedResource,
} from '@/types'
import qs from 'query-string'
import APIService from '../api-service'
import { downloadFileService } from '@/helpers'

/**
 * Service class to handle CRUD operations for Accounts.
 */
export default class AccountsService {
    private static readonly BASE_ENDPOINT = '/account'

    /**
     * Centralized request handling for better error management.
     */
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

    /**
     * Constructs the request URL with optional preloads.
     */
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
        return qs.stringifyUrl(
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

    public static async getAccounts({
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
        const url = this.buildUrl(``, { filters, preloads, pagination, sort })

        return this.makeRequest(() =>
            APIService.get<IAccountsPaginatedResource>(url)
        )
    }

    /**
     * Creates a new account.
     */
    public static async create(
        accountsData: IAccountsRequest,
        preloads?: string[]
    ): Promise<IAccountsResource> {
        const url = this.buildUrl('', { preloads })
        return this.makeRequest(() =>
            APIService.post<IAccountsRequest, IAccountsResource>(
                url,
                accountsData
            )
        )
    }

    /**
     * Deletes an account by ID.
     */
    public static async delete(id: TEntityId): Promise<void> {
        const url = this.buildUrl(`/${id}`, {})
        return this.makeRequest(() => APIService.delete(url))
    }

    /**
     * Updates an account by ID.
     */
    public static async update(
        id: TEntityId,
        accountData: IAccountsRequest,
        preloads?: string[]
    ): Promise<IAccountsResource> {
        const url = this.buildUrl(`/${id}`, { preloads })
        return this.makeRequest(() =>
            APIService.put<IAccountsRequest, IAccountsResource>(
                url,
                accountData
            )
        )
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const endpoint = `${AccountsService.BASE_ENDPOINT}/bulk-delete`

        const payload = { ids }

        await APIService.delete<void>(endpoint, payload)
    }

    public static async exportAll(): Promise<void> {
        const url = this.buildUrl(`/export`, {})
        await downloadFileService(url, 'all_accounts_export.xlsx')
    }

    public static async exportAllFiltered(filters?: string): Promise<void> {
        const url = this.buildUrl(`/export-search?filter=${filters || ''}`, {})
        await downloadFileService(url, 'filtered_accounts_export.xlsx')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        const url = qs.stringifyUrl(
            {
                url: `${AccountsService.BASE_ENDPOINT}/export-selected`,
                query: { ids },
            },
            { skipNull: true }
        )

        await downloadFileService(url, 'selected_accounts_export.xlsx')
    }

    public static async exportCurrentPage(page: number): Promise<void> {
        const url = this.buildUrl(`/export-current-page/${page}`, {})
        await downloadFileService(
            url,
            `current_page_accounts_${page}_export.xlsx`
        )
    }
}
