// services/CompanyService.ts
import qs from 'query-string'

import APIService from './api-service'
import { downloadFileService } from '@/helpers'

import {
    TEntityId,
    IMediaRequest,
    ICompanyRequest,
    ICompanyResource,
    ICompanyPaginatedResource,
} from '@/types'

/**
 * Service class to handle CRUD operations for companies.
 */
export default class CompanyService {
    private static readonly BASE_ENDPOINT = '/company'

    public static async getById(
        id: TEntityId,
        preloads?: string[]
    ): Promise<ICompanyResource> {
        // Construct each preload as a separate 'preloads' query parameter
        const url = qs.stringifyUrl(
            {
                url: `${CompanyService.BASE_ENDPOINT}/${id}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        // Make the GET request with necessary headers
        const response = await APIService.get<ICompanyResource>(url, {
            headers: {
                Authorization: `Bearer YOUR_TOKEN`, // Replace with actual token if needed
            },
        })

        return response.data
    }

    public static async create(
        companyData: ICompanyRequest,
        preloads?: string[]
    ): Promise<ICompanyResource> {
        const url = qs.stringifyUrl(
            {
                url: `${CompanyService.BASE_ENDPOINT}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        const response = await APIService.post<
            ICompanyRequest,
            ICompanyResource
        >(url, companyData)

        return response.data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${CompanyService.BASE_ENDPOINT}/${id}`
        await APIService.delete(endpoint)
    }

    public static async update(
        id: TEntityId,
        companyData: ICompanyRequest,
        preloads?: string[]
    ): Promise<ICompanyResource> {
        // Construct each preload as a separate 'preloads' query parameter
        const url = qs.stringifyUrl({
            url: `${CompanyService.BASE_ENDPOINT}/${id}`,
            query: { preloads },
        })

        // Make the PUT request with necessary headers
        const response = await APIService.put<
            ICompanyRequest,
            ICompanyResource
        >(url, companyData, {
            headers: {
                Authorization: `Bearer YOUR_TOKEN`, // Replace with actual token if needed
            },
        })
        return response.data
    }

    public static async getCompanies({
        filters,
        preloads,
        pagination,
        sort,
    }: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    } = {}): Promise<ICompanyPaginatedResource> {
        const url = qs.stringifyUrl(
            {
                url: `${CompanyService.BASE_ENDPOINT}`,
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

        const response = await APIService.get<ICompanyPaginatedResource>(url)
        return response.data
    }

    public static async exportAll(): Promise<void> {
        const url = `${CompanyService.BASE_ENDPOINT}/export`
        await downloadFileService(url, 'all_companies_export.csv')
    }

    public static async exportAllFiltered(filters?: string): Promise<void> {
        const url = qs.stringifyUrl(
            {
                url: `${this.BASE_ENDPOINT}/export-search`,
                query: { filters },
            },
            { skipNull: true }
        )
        await downloadFileService(url, 'filtered_companies_export.csv')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        if (ids.length === 0) {
            throw new Error('No company IDs provided for export.')
        }

        // Construct each preload as a separate 'preloads' query parameter if needed
        // (Assuming export-selected might also accept preloads; if not, you can omit this)

        const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join('&')
        const url = `${CompanyService.BASE_ENDPOINT}/export-selected?${query}`
        await downloadFileService(url, 'selected_companies_export.csv')
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const endpoint = `${CompanyService.BASE_ENDPOINT}/bulk-delete`

        // Construct the request payload
        const payload = { ids }

        // Make the DELETE request with the payload
        await APIService.delete<void>(endpoint, payload)
    }

    public static async verify(
        id: TEntityId,
        preloads?: string[]
    ): Promise<ICompanyResource> {
        const url = qs.stringifyUrl(
            {
                url: `${CompanyService.BASE_ENDPOINT}/verify/${id}`,
                query: {
                    preloads,
                },
            },
            { skipNull: true }
        )
        const response = await APIService.post<void, ICompanyResource>(url)
        return response.data
    }

    public static async ProfilePicture(
        id: TEntityId,
        data: IMediaRequest,
        preloads: string[] = ['Media', 'Owner', 'Owner.Media']
    ): Promise<ICompanyResource> {
        const url = qs.stringifyUrl(
            {
                url: `${CompanyService.BASE_ENDPOINT}/profile-picture/${id}`,
                query: {
                    preloads,
                },
            },
            { skipNull: true }
        )
        const response = await APIService.post<IMediaRequest, ICompanyResource>(
            url,
            data
        )
        return response.data
    }
}
