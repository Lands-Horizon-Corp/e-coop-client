import qs from 'query-string'

import APIService from '../api-service'
import { downloadFile } from '@/server/helpers'

import {
    TEntityId,
    IMemberClassificationRequest,
    IMemberClassificationResource,
    IMemberClassificationPaginatedResource,
} from '../../types'

export default class MemberClassificationService {
    private static readonly BASE_ENDPOINT = '/member-classification'

    public static async getById(
        id: TEntityId,
        preloads?: string[]
    ): Promise<IMemberClassificationResource> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberClassificationService.BASE_ENDPOINT}/${id}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        const response = await APIService.get<IMemberClassificationResource>(
            url,
            {
                headers: {
                    Authorization: `Bearer YOUR_TOKEN`,
                },
            }
        )

        return response.data
    }

    public static async create(
        data: IMemberClassificationRequest,
        preloads?: string[]
    ): Promise<IMemberClassificationResource> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberClassificationService.BASE_ENDPOINT}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        const response = await APIService.post<
            IMemberClassificationRequest,
            IMemberClassificationResource
        >(url, data)
        return response.data
    }

    public static async update(
        id: TEntityId,
        data: IMemberClassificationRequest,
        preloads?: string[]
    ): Promise<IMemberClassificationResource> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberClassificationService.BASE_ENDPOINT}/${id}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        const response = await APIService.put<
            IMemberClassificationRequest,
            IMemberClassificationResource
        >(url, data, {
            headers: {
                Authorization: `Bearer YOUR_TOKEN`,
            },
        })
        return response.data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${MemberClassificationService.BASE_ENDPOINT}/${id}`
        await APIService.delete(endpoint)
    }

    public static async getMemberClassifications({
        filters,
        preloads,
        pagination,
        sort,
    }: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    } = {}): Promise<IMemberClassificationPaginatedResource> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberClassificationService.BASE_ENDPOINT}`,
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

        const response =
            await APIService.get<IMemberClassificationPaginatedResource>(url)
        return response.data
    }

    public static async exportAll(): Promise<void> {
        const url = `${MemberClassificationService.BASE_ENDPOINT}/export`
        await downloadFile(url, 'all_member_classifications_export.csv')
    }

    public static async exportAllFiltered(filters?: string): Promise<void> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberClassificationService.BASE_ENDPOINT}/export-search`,
                query: { filters },
            },
            { skipNull: true }
        )
        await downloadFile(url, 'filtered_member_classifications_export.csv')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        if (ids.length === 0) {
            throw new Error('No member classification IDs provided for export.')
        }
        const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join('&')
        const url = `${MemberClassificationService.BASE_ENDPOINT}/export-selected?${query}`
        await downloadFile(url, 'selected_member_classifications_export.csv')
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const endpoint = `${MemberClassificationService.BASE_ENDPOINT}/bulk-delete`
        const payload = { ids }
        await APIService.delete<void>(endpoint, payload)
    }
}
