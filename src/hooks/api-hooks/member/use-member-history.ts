import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as MemberCenterHistoryService from '@/api-service/member-services/member-history-services'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IMemberCenterHistoryPaginated,
    IMemberClassificationHistoryPaginated,
    IMemberDepartmentHistoryPaginated,
    IMemberGenderHistoryPaginated,
    IMemberGroupHistoryPaginated,
    IMemberMutualFundsHistoryPaginated,
    IMemberOccupationHistoryPaginated,
    IMemberTypeHistoryPaginated,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useMemberCenterHistory = ({
    sort,
    enabled,
    profileId,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberCenterHistoryPaginated, string> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<IMemberCenterHistoryPaginated, string>({
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

export const useMemberGroupHistory = ({
    sort,
    enabled,
    profileId,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberGroupHistoryPaginated, string> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<IMemberGroupHistoryPaginated, string>({
        queryKey: [
            'member-group-history',
            'resource-query',
            profileId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterHistoryService.getMemberGroupHistoryById({
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
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberClassificationHistoryPaginated, string> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<IMemberClassificationHistoryPaginated, string>({
        queryKey: [
            'member-classification-history',
            'resource-query',
            profileId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterHistoryService.getMemberClassificationHistoryById({
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

export const useMemberTypeHistory = ({
    sort,
    enabled,
    profileId,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberTypeHistoryPaginated, string> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<IMemberTypeHistoryPaginated, string>({
        queryKey: [
            'member-type-history',
            'resource-query',
            profileId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterHistoryService.getMemberTypeHistoryById({
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
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberGenderHistoryPaginated, string> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<IMemberGenderHistoryPaginated, string>({
        queryKey: [
            'member-gender-history',
            'resource-query',
            profileId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterHistoryService.getMemberGenderHistoryById({
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

export const useMemberOccupationHistory = ({
    sort,
    enabled,
    profileId,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberOccupationHistoryPaginated, string> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<IMemberOccupationHistoryPaginated, string>({
        queryKey: [
            'member-occupation-history',
            'resource-query',
            profileId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterHistoryService.getMemberOccupationHistoryById({
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
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberMutualFundsHistoryPaginated, string> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<IMemberMutualFundsHistoryPaginated, string>({
        queryKey: [
            'member-mutual-fund-history',
            'resource-query',
            profileId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterHistoryService.getMemberMutualFundsHistoryById({
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

export const useMemberDepartmentHistory = ({
    sort,
    enabled,
    profileId,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberDepartmentHistoryPaginated, string> &
    IQueryProps & { profileId: TEntityId }) => {
    return useQuery<IMemberDepartmentHistoryPaginated, string>({
        queryKey: [
            'member-department-history',
            'resource-query',
            profileId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterHistoryService.getMemberDepartmentHistoryById({
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
