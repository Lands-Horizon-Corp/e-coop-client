// services/member-type-service.ts
import qs from 'query-string'

import APIService from '../api-service'
import {
    TEntityId,
    IMemberTypeHistoryPaginatedResource,
    IMemberGenderHistoryPaginatedResource,
    IMemberCenterHistoryPaginatedResource,
    IMemberMutualFundsHistoryPaginatedResource,
    IMemberClassificationHistoryPaginatedResource,
    IMemberEducationalAttainmentHistoryPaginatedResource,
} from '@/server/types'

export default class MemberHistoryService {
    private static readonly BASE_ENDPOINT = '/member-profile'

    public static async getMemberCenterHistoryById({
        profileId,
        ...props
    }: {
        sort?: string
        filters?: string
        preloads?: string[]
        profileId: TEntityId
        pagination?: { pageIndex: number; pageSize: number }
    }) {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${MemberHistoryService.BASE_ENDPOINT}/${profileId}/member-center-history`,
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
            await APIService.get<IMemberCenterHistoryPaginatedResource>(url)
        return response.data
    }

    public static async getMemberClassificationHistoryById({
        profileId,
        ...props
    }: {
        sort?: string
        filters?: string
        preloads?: string[]
        profileId: TEntityId
        pagination?: { pageIndex: number; pageSize: number }
    }) {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${MemberHistoryService.BASE_ENDPOINT}/${profileId}/member-classification-history`,
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
            await APIService.get<IMemberClassificationHistoryPaginatedResource>(
                url
            )
        return response.data
    }

    public static async getMemberEducationalAttainmentHistoryById({
        profileId,
        ...props
    }: {
        sort?: string
        filters?: string
        preloads?: string[]
        profileId: TEntityId
        pagination?: { pageIndex: number; pageSize: number }
    }) {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${MemberHistoryService.BASE_ENDPOINT}/${profileId}/member-educational-attainment-history`,
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
            await APIService.get<IMemberEducationalAttainmentHistoryPaginatedResource>(
                url
            )
        return response.data
    }

    public static async getMemberTypeHistoryById({
        profileId,
        ...props
    }: {
        sort?: string
        filters?: string
        preloads?: string[]
        profileId: TEntityId
        pagination?: { pageIndex: number; pageSize: number }
    }) {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${MemberHistoryService.BASE_ENDPOINT}/${profileId}/member-type-history`,
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
            await APIService.get<IMemberTypeHistoryPaginatedResource>(url)
        return response.data
    }

    public static async getMemberGenderHistoryById({
        profileId,
        ...props
    }: {
        sort?: string
        filters?: string
        preloads?: string[]
        profileId: TEntityId
        pagination?: { pageIndex: number; pageSize: number }
    }) {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${MemberHistoryService.BASE_ENDPOINT}/${profileId}/member-gender-history`,
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
            await APIService.get<IMemberGenderHistoryPaginatedResource>(url)
        return response.data
    }

    public static async getMemberMutualFundsHistoryById({
        profileId,
        ...props
    }: {
        sort?: string
        filters?: string
        preloads?: string[]
        profileId: TEntityId
        pagination?: { pageIndex: number; pageSize: number }
    }) {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${MemberHistoryService.BASE_ENDPOINT}/${profileId}/member-mutual-funds-history`,
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
            await APIService.get<IMemberMutualFundsHistoryPaginatedResource>(
                url
            )
        return response.data
    }
}
