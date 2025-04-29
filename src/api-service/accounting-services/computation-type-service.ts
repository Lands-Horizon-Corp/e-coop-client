import {
    TEntityId,
    IAccountsComputationTypeRequest,
    IAccountsComputationTypeResource,
    IAccountsComputationTypePaginatedResource,
} from '@/types'

import qs from 'query-string'
import APIService from '../api-service'
import { downloadFileService } from '@/helpers'

/**
 * Service class to handle CRUD operations for Computation Types.
 */
export default class ComputationTypeService {
    private static readonly BASE_ENDPOINT = '/computation-type'

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

    /**
     * Creates a new computation type.
     */
    public static async create(
        computationTypeData: IAccountsComputationTypeRequest,
        preloads?: string[]
    ): Promise<IAccountsComputationTypeResource> {
        const url = this.buildUrl('', { preloads })
        return this.makeRequest(() =>
            APIService.post<
                IAccountsComputationTypeRequest,
                IAccountsComputationTypeResource
            >(url, computationTypeData)
        )
    }

    /**
     * Deletes a computation type by ID.
     */
    public static async delete(id: TEntityId): Promise<void> {
        const url = this.buildUrl(`/${id}`, {})
        return this.makeRequest(() => APIService.delete(url))
    }

    /**
     * Updates a computation type by ID.
     */
    public static async update(
        id: TEntityId,
        computationTypeData: IAccountsComputationTypeRequest,
        preloads?: string[]
    ): Promise<IAccountsComputationTypeResource> {
        const url = this.buildUrl(`/${id}`, { preloads })
        return this.makeRequest(() =>
            APIService.put<
                IAccountsComputationTypeRequest,
                IAccountsComputationTypeResource
            >(url, computationTypeData)
        )
    }

    /**
     * Fetches computation types with optional filters, preloads, sorting, and pagination.
     */
    public static async getComputationTypes({
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
            APIService.get<IAccountsComputationTypePaginatedResource>(url)
        )
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const endpoint = `${ComputationTypeService.BASE_ENDPOINT}/bulk-delete`

        const payload = { ids }

        await APIService.delete<void>(endpoint, payload)
    }

    public static async exportAll(): Promise<void> {
        const url = this.buildUrl(`/export`, {})
        await downloadFileService(url, 'all_computation_type_export.xlsx')
    }

    public static async exportAllFiltered(filters?: string): Promise<void> {
        const url = this.buildUrl(`/export-search?filter=${filters || ''}`, {})
        await downloadFileService(url, 'filtered_computation_type_export.xlsx')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        const url = qs.stringifyUrl(
            {
                url: `${ComputationTypeService.BASE_ENDPOINT}/export-selected`,
                query: { ids },
            },
            { skipNull: true }
        )

        await downloadFileService(url, 'selected_computation_type_export.xlsx')
    }

    public static async exportCurrentPage(page: number): Promise<void> {
        const url = this.buildUrl(`/export-current-page/${page}`, {})
        await downloadFileService(
            url,
            `current_page_computation_type_${page}_export.xlsx`
        )
    }
}
