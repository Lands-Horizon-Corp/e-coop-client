import qs from 'query-string'

import APIService from '../api-service'
import { downloadFileService } from '@/helpers'

import {
    TEntityId,
    IMemberEducationalAttainmentRequest,
    IMemberEducationalAttainment,
    IMemberEducationalAttainmentPaginated,
} from '@/types'

export default class MemberEducationalAttainmentService {
    private static readonly BASE_ENDPOINT = '/member-educational-attainment'

    public static async getById(
        id: TEntityId,
        preloads?: string[]
    ): Promise<IMemberEducationalAttainment> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberEducationalAttainmentService.BASE_ENDPOINT}/${id}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        const response = await APIService.get<IMemberEducationalAttainment>(
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
        data: IMemberEducationalAttainmentRequest,
        preloads?: string[]
    ): Promise<IMemberEducationalAttainment> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberEducationalAttainmentService.BASE_ENDPOINT}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        const response = await APIService.post<
            IMemberEducationalAttainmentRequest,
            IMemberEducationalAttainment
        >(url, data)
        return response.data
    }

    public static async update(
        id: TEntityId,
        data: IMemberEducationalAttainmentRequest,
        preloads?: string[]
    ): Promise<IMemberEducationalAttainment> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberEducationalAttainmentService.BASE_ENDPOINT}/${id}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        const response = await APIService.put<
            IMemberEducationalAttainmentRequest,
            IMemberEducationalAttainment
        >(url, data, {
            headers: {
                Authorization: `Bearer YOUR_TOKEN`,
            },
        })
        return response.data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${MemberEducationalAttainmentService.BASE_ENDPOINT}/${id}`
        await APIService.delete(endpoint)
    }

    public static async getMemberEducationalAttainments({
        filters,
        preloads,
        pagination,
        sort,
    }: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    } = {}): Promise<IMemberEducationalAttainmentPaginated> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberEducationalAttainmentService.BASE_ENDPOINT}`,
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
            await APIService.get<IMemberEducationalAttainmentPaginated>(url)
        return response.data
    }

    public static async exportAll(): Promise<void> {
        const url = `${MemberEducationalAttainmentService.BASE_ENDPOINT}/export`
        await downloadFileService(
            url,
            'all_member_educational_attainments_export.csv'
        )
    }

    public static async exportAllFiltered(filters?: string): Promise<void> {
        const url = qs.stringifyUrl(
            {
                url: `${MemberEducationalAttainmentService.BASE_ENDPOINT}/export-search`,
                query: { filters },
            },
            { skipNull: true }
        )
        await downloadFileService(
            url,
            'filtered_member_educational_attainments_export.csv'
        )
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        if (ids.length === 0) {
            throw new Error(
                'No member educational attainment IDs provided for export.'
            )
        }
        const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join('&')
        const url = `${MemberEducationalAttainmentService.BASE_ENDPOINT}/export-selected?${query}`
        await downloadFileService(
            url,
            'selected_member_educational_attainments_export.csv'
        )
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const endpoint = `${MemberEducationalAttainmentService.BASE_ENDPOINT}/bulk-delete`
        const payload = { ids }
        await APIService.delete<void>(endpoint, payload)
    }
}
