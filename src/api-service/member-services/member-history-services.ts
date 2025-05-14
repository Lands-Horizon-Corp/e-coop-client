import qs from 'query-string'
import APIService from '../api-service'
import {
    TEntityId,
    IMemberTypeHistoryPaginated,
    IMemberGenderHistoryPaginated,
    IMemberCenterHistoryPaginated,
    IMemberMutualFundsHistoryPaginated,
    IMemberClassificationHistoryPaginated,
} from '@/types'

const BASE_ENDPOINT = '/member-profile'

export const getMemberCenterHistoryById = async ({
    profileId,
    ...props
}: {
    sort?: string
    filters?: string
    preloads?: string[]
    profileId: TEntityId
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${profileId}/member-center-history`,
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

    const response = await APIService.get<IMemberCenterHistoryPaginated>(url)
    return response.data
}

export const getMemberClassificationHistoryById = async ({
    profileId,
    ...props
}: {
    sort?: string
    filters?: string
    preloads?: string[]
    profileId: TEntityId
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${profileId}/member-classification-history`,
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

export const getMemberTypeHistoryById = async ({
    profileId,
    ...props
}: {
    sort?: string
    filters?: string
    preloads?: string[]
    profileId: TEntityId
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${profileId}/member-type-history`,
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

export const getMemberGenderHistoryById = async ({
    profileId,
    ...props
}: {
    sort?: string
    filters?: string
    preloads?: string[]
    profileId: TEntityId
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${profileId}/member-gender-history`,
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

    const response = await APIService.get<IMemberGenderHistoryPaginated>(url)
    return response.data
}

export const getMemberMutualFundsHistoryById = async ({
    profileId,
    ...props
}: {
    sort?: string
    filters?: string
    preloads?: string[]
    profileId: TEntityId
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${profileId}/member-mutual-funds-history`,
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
