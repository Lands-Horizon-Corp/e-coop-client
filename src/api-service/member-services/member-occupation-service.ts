import qs from 'query-string'

import APIService from '../api-service'
import { downloadFileService } from '@/helpers'

import {
    TEntityId,
    IMemberOccupation,
    IMemberOccupationRequest,
    IMemberOccupationPaginated,
} from '@/types'

export default class MemberOccupationService {
    private static readonly BASE_ENDPOINT = '/member-occupation'

    public static async getById(
        id: TEntityId,
        preloads?: string[]
    ): Promise<IMemberOccupation> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberOccupationService.BASE_ENDPOINT}/${id}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        const response = await APIService.get<IMemberOccupation>(url, {
            headers: {
                Authorization: `Bearer YOUR_TOKEN`,
            },
        })

        return response.data
    }

    public static async create(
        data: IMemberOccupationRequest,
        preloads?: string[]
    ): Promise<IMemberOccupation> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberOccupationService.BASE_ENDPOINT}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        const response = await APIService.post<
            IMemberOccupationRequest,
            IMemberOccupation
        >(url, data)
        return response.data
    }

    public static async update(
        id: TEntityId,
        data: IMemberOccupationRequest,
        preloads?: string[]
    ): Promise<IMemberOccupation> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberOccupationService.BASE_ENDPOINT}/${id}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        const response = await APIService.put<
            IMemberOccupationRequest,
            IMemberOccupation
        >(url, data, {
            headers: {
                Authorization: `Bearer YOUR_TOKEN`,
            },
        })
        return response.data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${MemberOccupationService.BASE_ENDPOINT}/${id}`
        await APIService.delete(endpoint)
    }

    public static async getMemberOccupations({
        filters,
        preloads,
        pagination,
        sort,
    }: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    } = {}): Promise<IMemberOccupationPaginated> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberOccupationService.BASE_ENDPOINT}`,
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

        const response = await APIService.get<IMemberOccupationPaginated>(url)
        return response.data
    }

    public static async exportAll(): Promise<void> {
        const url = `${MemberOccupationService.BASE_ENDPOINT}/export`
        await downloadFileService(url, 'all_member_occupations_export.csv')
    }

    public static async exportAllFiltered(filters?: string): Promise<void> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberOccupationService.BASE_ENDPOINT}/export-search`,
                query: { filters },
            },
            { skipNull: true }
        )
        await downloadFileService(url, 'filtered_member_occupations_export.csv')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        if (ids.length === 0) {
            throw new Error('No member occupation IDs provided for export.')
        }
        const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join('&')
        const url = `${MemberOccupationService.BASE_ENDPOINT}/export-selected?${query}`
        await downloadFileService(url, 'selected_member_occupations_export.csv')
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const endpoint = `${MemberOccupationService.BASE_ENDPOINT}/bulk-delete`
        const payload = { ids }
        await APIService.delete<void>(endpoint, payload)
    }
}
