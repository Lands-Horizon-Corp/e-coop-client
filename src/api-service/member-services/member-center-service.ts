// services/member-type-service.ts
import qs from 'query-string'

import APIService from '../api-service'
import { downloadFileService } from '@/helpers'

import {
    TEntityId,
    IMemberCenterRequest,
    IMemberCenterResource,
    IMemberCenterPaginatedResource,
} from '@/types'

export default class MemberCenterService {
    private static readonly BASE_ENDPOINT = '/member-type'

    public static async getById(
        id: TEntityId,
        preloads?: string[]
    ): Promise<IMemberCenterResource> {
        const url = qs.stringifyUrl({
            url: `${MemberCenterService.BASE_ENDPOINT}/${id}`,
            query: { preloads },
        })

        const response = await APIService.get<IMemberCenterResource>(url)
        return response.data
    }

    public static async create(
        data: IMemberCenterRequest,
        preloads?: string[]
    ) {
        const url = qs.stringifyUrl(
            {
                url: `${MemberCenterService.BASE_ENDPOINT}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        return (
            await APIService.post<IMemberCenterRequest, IMemberCenterResource>(
                url,
                data
            )
        ).data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${MemberCenterService.BASE_ENDPOINT}/${id}`
        await APIService.delete<void>(endpoint)
    }

    public static async update(
        id: TEntityId,
        data: IMemberCenterRequest,
        preloads?: string[]
    ): Promise<IMemberCenterResource> {
        const url = qs.stringifyUrl({
            url: `${MemberCenterService.BASE_ENDPOINT}/${id}`,
            query: { preloads },
        })

        const response = await APIService.put<
            IMemberCenterRequest,
            IMemberCenterResource
        >(url, data)
        return response.data
    }

    public static async getMemberCenters(props?: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    }) {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${MemberCenterService.BASE_ENDPOINT}`,
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
            await APIService.get<IMemberCenterPaginatedResource>(url)
        return response.data
    }

    public static async exportAll(): Promise<void> {
        const url = `${MemberCenterService.BASE_ENDPOINT}/export`
        await downloadFileService(url, 'all_member_types_export.csv')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        if (ids.length === 0) {
            throw new Error('No member type IDs provided for export.')
        }
        const url = qs.stringifyUrl(
            {
                url: `${MemberCenterService.BASE_ENDPOINT}/export-selected`,
                query: { ids },
            },
            { skipNull: true }
        )

        await downloadFileService(url, 'selected_member_types_export.csv')
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const endpoint = `${MemberCenterService.BASE_ENDPOINT}/bulk-delete`
        await APIService.delete<void>(endpoint, { ids })
    }
}
