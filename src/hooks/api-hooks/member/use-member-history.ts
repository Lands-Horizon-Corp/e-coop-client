import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import {
    TEntityId,
    IQueryProps,
    IAPIFilteredPaginatedHook,
    IMemberTypeHistoryPaginated,
    IMemberCenterHistoryPaginated,
    IMemberGenderHistoryPaginated,
    IMemberMutualFundsHistoryPaginated,
    IMemberClassificationHistoryPaginated,
    // IMemberEducationalAttainmentHistoryPaginated,
} from '@/types'
import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as MemberCenterHistoryService from '@/api-service/member-services/member-history-services'

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

// export const useMemberEducationalAttainmentHistory = ({
//     sort,
//     enabled,
//     profileId,
//     filterPayload,
//     showMessage = true,
//     pagination = { pageSize: 10, pageIndex: 1 },
// }: IAPIFilteredPaginatedHook<
//     IMemberEducationalAttainmentHistoryPaginated,
//     string
// > &
//     IQueryProps & { profileId: TEntityId }) => {
//     return useQuery<IMemberEducationalAttainmentHistoryPaginated, string>({
//         queryKey: [
//             'member-center-history',
//             'resource-query',
//             profileId,
//             filterPayload,
//             pagination,
//             sort,
//         ],
//         queryFn: async () => {
//             const [error, result] = await withCatchAsync(
//                 MemberCenterHistoryService.getMemberEducationalAttainmentHistoryById(
//                     {
//                         profileId,
//                         pagination,
//                         sort: sort && toBase64(sort),
//                         filters: filterPayload && toBase64(filterPayload),
//                     }
//                 )
//             )

//             if (error) {
//                 const errorMessage = serverRequestErrExtractor({ error })
//                 if (showMessage) toast.error(errorMessage)
//                 throw errorMessage
//             }

//             return result
//         },
//         initialData: {
//             data: [],
//             pages: [],
//             totalSize: 0,
//             totalPage: 1,
//             ...pagination,
//         },
//         enabled,
//         retry: 1,
//     })
// }

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
