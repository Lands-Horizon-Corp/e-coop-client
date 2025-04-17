// services/member-type-service.ts
import qs from 'query-string'

import APIService from '../api-service'
import { downloadFile } from '../../helpers'

import { TEntityId } from '@/server/types'
import {
    IMemberTypeRequest,
    IMemberTypeResource,
    IMemberTypePaginatedResource,
} from '@/server/types/member/member-type'

export default class MemberTypeService {
    private static readonly BASE_ENDPOINT = '/member-type'

    public static async getById(
        id: TEntityId,
        preloads?: string[]
    ): Promise<IMemberTypeResource> {
        const url = qs.stringifyUrl({
            url: `${MemberTypeService.BASE_ENDPOINT}/${id}`,
            query: { preloads },
        })

        const response = await APIService.get<IMemberTypeResource>(url)
        return response.data
    }

    public static async create(data: IMemberTypeRequest, preloads?: string[]) {
        const url = qs.stringifyUrl(
            {
                url: `${MemberTypeService.BASE_ENDPOINT}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        return (
            await APIService.post<IMemberTypeRequest, IMemberTypeResource>(
                url,
                data
            )
        ).data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${MemberTypeService.BASE_ENDPOINT}/${id}`
        await APIService.delete<void>(endpoint)
    }

    public static async update(
        id: TEntityId,
        data: IMemberTypeRequest,
        preloads?: string[]
    ): Promise<IMemberTypeResource> {
        const url = qs.stringifyUrl({
            url: `${MemberTypeService.BASE_ENDPOINT}/${id}`,
            query: { preloads },
        })

        const response = await APIService.put<
            IMemberTypeRequest,
            IMemberTypeResource
        >(url, data)
        return response.data
    }

    public static async getMemberTypes(props?: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    }) {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${MemberTypeService.BASE_ENDPOINT}`,
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

        const response = await APIService.get<IMemberTypePaginatedResource>(url)
        return response.data
    }

    public static async exportAll(): Promise<void> {
        const url = `${MemberTypeService.BASE_ENDPOINT}/export`
        await downloadFile(url, 'all_member_types_export.csv')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        if (ids.length === 0) {
            throw new Error('No member type IDs provided for export.')
        }
        const url = qs.stringifyUrl(
            {
                url: `${MemberTypeService.BASE_ENDPOINT}/export-selected`,
                query: { ids },
            },
            { skipNull: true }
        )

        await downloadFile(url, 'selected_member_types_export.csv')
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const endpoint = `${MemberTypeService.BASE_ENDPOINT}/bulk-delete`
        await APIService.delete<void>(endpoint, { ids })
    }
}
