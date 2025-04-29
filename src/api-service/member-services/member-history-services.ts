// services/member-type-service.ts
import qs from 'query-string'

import APIService from '../api-service'
import {
    TEntityId,
    IMemberTypeHistoryPaginated,
    IMemberGenderHistoryPaginated,
    IMemberCenterHistoryPaginated,
    IMemberMutualFundsHistoryPaginated,
    IMemberClassificationHistoryPaginated,
    IMemberEducationalAttainmentHistoryPaginated,
} from '@/types'

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
            await APIService.get<IMemberCenterHistoryPaginated>(url)
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
            await APIService.get<IMemberClassificationHistoryPaginated>(url)
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
            await APIService.get<IMemberEducationalAttainmentHistoryPaginated>(
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

        const response = await APIService.get<IMemberTypeHistoryPaginated>(url)
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
            await APIService.get<IMemberGenderHistoryPaginated>(url)
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
            await APIService.get<IMemberMutualFundsHistoryPaginated>(url)
        return response.data
    }
}
