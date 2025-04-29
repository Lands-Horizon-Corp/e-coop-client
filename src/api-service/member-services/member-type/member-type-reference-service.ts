// services/member-type-service.ts
import qs from 'query-string'

import APIService from '../../api-service'

import {
    TEntityId,
    IMemberTypeReferenceRequest,
    IMemberTypeReferenceResource,
} from '@/types'
import { IMemberTypePaginatedResource } from '@/types'

export default class MemberTypeReferenceService {
    private static readonly BASE_ENDPOINT = '/member-type-reference'

    public static async getById(
        id: TEntityId,
        preloads?: string[]
    ): Promise<IMemberTypeReferenceResource> {
        const url = qs.stringifyUrl({
            url: `${MemberTypeReferenceService.BASE_ENDPOINT}/${id}`,
            query: { preloads },
        })

        const response = await APIService.get<IMemberTypeReferenceResource>(url)
        return response.data
    }

    public static async create(
        data: IMemberTypeReferenceRequest,
        preloads?: string[]
    ) {
        const url = qs.stringifyUrl(
            {
                url: `${MemberTypeReferenceService.BASE_ENDPOINT}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        return (
            await APIService.post<
                IMemberTypeReferenceRequest,
                IMemberTypeReferenceResource
            >(url, data)
        ).data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${MemberTypeReferenceService.BASE_ENDPOINT}/${id}`
        await APIService.delete<void>(endpoint)
    }

    public static async update(
        id: TEntityId,
        data: IMemberTypeReferenceRequest,
        preloads?: string[]
    ): Promise<IMemberTypeReferenceResource> {
        const url = qs.stringifyUrl({
            url: `${MemberTypeReferenceService.BASE_ENDPOINT}/${id}`,
            query: { preloads },
        })

        const response = await APIService.put<
            IMemberTypeReferenceRequest,
            IMemberTypeReferenceResource
        >(url, data)
        return response.data
    }

    public static async getMemberTypeReferences(props?: {
        memberTypeId: string
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    }) {
        const { memberTypeId, filters, preloads, pagination, sort } =
            props || {}

        const url = qs.stringifyUrl(
            {
                url: `${MemberTypeReferenceService.BASE_ENDPOINT}/${memberTypeId}`,
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

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const endpoint = `${MemberTypeReferenceService.BASE_ENDPOINT}/bulk-delete`
        await APIService.delete<void>(endpoint, { ids })
    }
}
