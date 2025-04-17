import qs from 'query-string'

import APIService from './api-service'
import { downloadFile } from '../helpers'

import {
    TEntityId,
    IOwnerRequest,
    IOwnerResource,
    IOwnerPaginatedResource,
    IBranchPaginatedResource,
    ICompanyResource,
} from '../types'

/**
 * Service class to handle CRUD operations for owners.
 */
export default class OwnerService {
    private static readonly BASE_ENDPOINT = '/owner'

    public static async getById(
        id: TEntityId,
        preloads?: string[]
    ): Promise<IOwnerResource> {
        const url = qs.stringifyUrl({
            url: `${OwnerService.BASE_ENDPOINT}/${id}`,
            query: { preloads },
        })

        const response = await APIService.get<IOwnerResource>(url)
        return response.data
    }

    public static async create(
        ownerData: IOwnerRequest
    ): Promise<IOwnerResource> {
        const response = await APIService.post<IOwnerRequest, IOwnerResource>(
            OwnerService.BASE_ENDPOINT,
            ownerData
        )
        return response.data
    }

    public static async update(
        id: TEntityId,
        ownerData: IOwnerRequest,
        preloads?: string[]
    ): Promise<IOwnerResource> {
        const url = qs.stringifyUrl({
            url: `${OwnerService.BASE_ENDPOINT}/${id}`,
            query: { preloads },
        })

        const response = await APIService.put<IOwnerRequest, IOwnerResource>(
            url,
            ownerData
        )
        return response.data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${OwnerService.BASE_ENDPOINT}/${id}`
        await APIService.delete<void>(endpoint)
    }

    public static async getOwnCompany(id: TEntityId, preloads?: string[]) {
        const url = qs.stringifyUrl(
            {
                url: `${OwnerService.BASE_ENDPOINT}/${id}/company`,
                query: { preloads },
            },
            { skipNull: true }
        )
        return (await APIService.get<ICompanyResource>(url)).data
    }

    public static async getOwners(props?: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    }): Promise<IOwnerPaginatedResource> {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${OwnerService.BASE_ENDPOINT}`,
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

        const response = await APIService.get<IOwnerPaginatedResource>(url)
        return response.data
    }

    public static async verify(id: TEntityId): Promise<IOwnerResource> {
        const endpoint = `${OwnerService.BASE_ENDPOINT}/verify/${id}`
        const response = await APIService.post<void, IOwnerResource>(endpoint)
        return response.data
    }

    public static async getBranches({
        sort,
        ownerId,
        filters,
        preloads,
        pagination,
    }: {
        ownerId: TEntityId
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
        sort?: string
    }) {
        const url = qs.stringifyUrl(
            {
                url: `${OwnerService.BASE_ENDPOINT}/${ownerId}/branch`,
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
        const url = `${OwnerService.BASE_ENDPOINT}/export`
        await downloadFile(url, 'all_owners_export.csv')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        if (ids.length === 0) {
            throw new Error('No owner IDs provided for export.')
        }

        const url = qs.stringifyUrl({
            url: `${OwnerService.BASE_ENDPOINT}/export-selected`,
            query: { ids },
        })

        await downloadFile(url, 'selected_owners_export.csv')
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const url = `${OwnerService.BASE_ENDPOINT}/bulk-delete`
        const payload = { ids }

        await APIService.delete<void>(url, payload)
    }
}
