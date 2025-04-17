// services/BranchService.ts
import qs from 'query-string'

import APIService from './api-service'
import { downloadFile } from '@/server/helpers'

import {
    TEntityId,
    IMediaRequest,
    IBranchRequest,
    IBranchResource,
    IBranchPaginatedResource,
} from '@/server/types'

/**
 * Service class to handle CRUD operations for branches.
 */
export default class BranchService {
    private static readonly BASE_ENDPOINT = '/branch'

    public static async getById(
        id: TEntityId,
        preloads?: string[]
    ): Promise<IBranchResource> {
        const url = qs.stringifyUrl(
            {
                url: `${BranchService.BASE_ENDPOINT}/${id}`,
                query: {
                    preloads,
                },
            },
            { skipNull: true }
        )

        const response = await APIService.get<IBranchResource>(url, {
            headers: {
                Authorization: `Bearer YOUR_TOKEN`,
            },
        })

        return response.data
    }

    public static async create(
        branchData: IBranchRequest,
        preloads?: string[]
    ): Promise<IBranchResource> {
        const url = qs.stringifyUrl(
            {
                url: `${BranchService.BASE_ENDPOINT}`,
                query: {
                    preloads,
                },
            },
            { skipNull: true }
        )

        const response = await APIService.post<IBranchRequest, IBranchResource>(
            url,
            branchData
        )
        return response.data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${BranchService.BASE_ENDPOINT}/${id}`
        await APIService.delete<void>(endpoint)
    }

    public static async update(
        id: TEntityId,
        branchData: IBranchRequest,
        preloads?: string[]
    ): Promise<IBranchResource> {
        const url = qs.stringifyUrl(
            {
                url: `${BranchService.BASE_ENDPOINT}/${id}`,
                query: {
                    preloads,
                },
            },
            { skipNull: true }
        )

        const response = await APIService.put<IBranchRequest, IBranchResource>(
            url,
            branchData,
            {
                headers: {
                    Authorization: `Bearer YOUR_TOKEN`, // Replace with actual token if needed
                },
            }
        )
        return response.data
    }

    public static async getBranches(props?: {
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
        sort?: string
    }): Promise<IBranchPaginatedResource> {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${BranchService.BASE_ENDPOINT}`,
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

        const response = await APIService.get<IBranchPaginatedResource>(url)
        return response.data
    }

    public static async exportAll(): Promise<void> {
        const url = `${BranchService.BASE_ENDPOINT}/export`
        await downloadFile(url, 'all_branches_export.csv')
    }

    public static async exportAllFiltered(filters?: string): Promise<void> {
        const filterQuery = filters
            ? `filter=${encodeURIComponent(filters)}`
            : ''
        const url = `${BranchService.BASE_ENDPOINT}/export-search${filterQuery ? `?${filterQuery}` : ''}`
        await downloadFile(url, 'filtered_branches_export.csv')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        if (ids.length === 0) {
            throw new Error('No branch IDs provided for export.')
        }

        // Construct each preload as a separate 'preloads' query parameter if needed
        // (Assuming export-selected might also accept preloads; if not, you can omit this)

        const url = qs.stringifyUrl(
            {
                url: `${BranchService.BASE_ENDPOINT}/export-selected`,
                query: { ids },
            },
            { skipNull: true }
        )

        await downloadFile(url, 'selected_branches_export.csv')
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const endpoint = `${BranchService.BASE_ENDPOINT}/bulk-delete`

        // Construct the request payload
        const payload = { ids }

        // Make the DELETE request with the payload
        await APIService.delete<void>(endpoint, payload)
    }

    public static async verify(id: TEntityId): Promise<IBranchResource> {
        const endpoint = `${BranchService.BASE_ENDPOINT}/verify/${id}`
        const response = await APIService.post<void, IBranchResource>(endpoint)
        return response.data
    }

    public static async ProfilePicture(
        id: TEntityId,
        data: IMediaRequest,
        preloads: string[] = ['Media']
    ): Promise<IBranchResource> {
        const url = qs.stringifyUrl(
            {
                url: `${BranchService.BASE_ENDPOINT}/profile-picture/${id}`,
                query: {
                    preloads,
                },
            },
            { skipNull: true }
        )

        const response = await APIService.post<IMediaRequest, IBranchResource>(
            url,
            data
        )
        return response.data
    }
}
