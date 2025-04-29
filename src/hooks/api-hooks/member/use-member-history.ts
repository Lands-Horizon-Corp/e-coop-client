import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import {
    TEntityId,
    IMemberTypeHistoryPaginatedResource,
    IMemberGenderHistoryPaginatedResource,
    IMemberCenterHistoryPaginatedResource,
    IMemberMutualFundsHistoryPaginatedResource,
    IMemberClassificationHistoryPaginatedResource,
    IMemberEducationalAttainmentHistoryPaginatedResource,
} from '@/types'
import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import MemberCenterHistoryService from '@/api-service/member-services/member-history-services'

import { IAPIFilteredPaginatedHook, IQueryProps } from '../types'

export const useMemberCenterHistory = ({
    sort,
    enabled,
    profileId,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberCenterHistoryPaginatedResource, string> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<IMemberCenterHistoryPaginatedResource, string>({
        queryKey: [
            'member-center-history',
            'resource-query',
            profileId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterHistoryService.getMemberCenterHistoryById({
                    preloads,
                    profileId,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}

export const useMemberClassificationHistory = ({
    sort,
    enabled,
    profileId,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<
    IMemberClassificationHistoryPaginatedResource,
    string
> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<IMemberClassificationHistoryPaginatedResource, string>({
        queryKey: [
            'member-center-history',
            'resource-query',
            profileId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterHistoryService.getMemberClassificationHistoryById({
                    preloads,
                    profileId,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}

export const useMemberEducationalAttainmentHistory = ({
    sort,
    enabled,
    profileId,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<
    IMemberEducationalAttainmentHistoryPaginatedResource,
    string
> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<
        IMemberEducationalAttainmentHistoryPaginatedResource,
        string
    >({
        queryKey: [
            'member-center-history',
            'resource-query',
            profileId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterHistoryService.getMemberEducationalAttainmentHistoryById(
                    {
                        preloads,
                        profileId,
                        pagination,
                        sort: sort && toBase64(sort),
                        filters: filterPayload && toBase64(filterPayload),
                    }
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}

export const useMemberTypeHistory = ({
    sort,
    enabled,
    profileId,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberTypeHistoryPaginatedResource, string> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<IMemberTypeHistoryPaginatedResource, string>({
        queryKey: [
            'member-center-history',
            'resource-query',
            profileId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterHistoryService.getMemberTypeHistoryById({
                    preloads,
                    profileId,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}

export const useMemberGenderHistory = ({
    sort,
    enabled,
    profileId,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberGenderHistoryPaginatedResource, string> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<IMemberGenderHistoryPaginatedResource, string>({
        queryKey: [
            'member-center-history',
            'resource-query',
            profileId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterHistoryService.getMemberGenderHistoryById({
                    preloads,
                    profileId,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}

export const useMemberMutualFundsHistory = ({
    sort,
    enabled,
    profileId,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<
    IMemberMutualFundsHistoryPaginatedResource,
    string
> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<IMemberMutualFundsHistoryPaginatedResource, string>({
        queryKey: [
            'member-center-history',
            'resource-query',
            profileId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterHistoryService.getMemberMutualFundsHistoryById({
                    preloads,
                    profileId,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}
