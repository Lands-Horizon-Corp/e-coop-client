import qs from 'query-string'

import {
    IMemberCenterHistoryPaginated,
    IMemberClassificationHistoryPaginated,
    IMemberGenderHistoryPaginated,
    IMemberGroupHistoryPaginated,
    IMemberMutualFundsHistoryPaginated,
    IMemberOccupationHistoryPaginated,
    IMemberTypeHistoryPaginated,
    TEntityId,
} from '@/types'

import APIService from '../api-service'

export const getMemberCenterHistoryById = async ({
    profileId,
    ...props
}: {
    sort?: string
    filters?: string
    profileId: TEntityId
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/api/v1/member-center-history/member-profile/${profileId}/search`,
            query: {
                sort,
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
    profileId: TEntityId
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/api/v1/member-classification-history/member-profile/${profileId}/search`,
            query: {
                sort,
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
    profileId: TEntityId
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/api/v1/member-type-history/member-profile/${profileId}/search`,
            query: {
                sort,
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
    profileId: TEntityId
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/api/v1/member-gender-history/member-profile/${profileId}/search`,
            query: {
                sort,
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

export const getMemberGroupHistoryById = async ({
    profileId,
    ...props
}: {
    sort?: string
    filters?: string
    profileId: TEntityId
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/api/v1/member-group-history/member-profile/${profileId}/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IMemberGroupHistoryPaginated>(url)
    return response.data
}

export const getMemberOccupationHistoryById = async ({
    profileId,
    ...props
}: {
    sort?: string
    filters?: string
    profileId: TEntityId
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/api/v1/member-occupation-history/member-profile/${profileId}/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response =
        await APIService.get<IMemberOccupationHistoryPaginated>(url)
    return response.data
}

export const getMemberMutualFundsHistoryById = async ({
    profileId,
    ...props
}: {
    sort?: string
    filters?: string
    profileId: TEntityId
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/api/v1/member-mutual-funds-history/member-profile/${profileId}/search`,
            query: {
                sort,
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
