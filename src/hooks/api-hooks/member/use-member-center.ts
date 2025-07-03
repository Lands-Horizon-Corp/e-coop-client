import { queryOptions, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import MemberCenterService from '@/api-service/member-services/member-center-service'
import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IMemberCenter,
    IMemberCenterPaginated,
    IMemberCenterRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const memberCenterLoader = (memberCenterId: TEntityId) =>
    queryOptions<IMemberCenter>({
        queryKey: ['member-center', 'loader', memberCenterId],
        queryFn: async () => {
            const data = await MemberCenterService.getById(memberCenterId)
            return data
        },
        retry: 0,
    })

export const useCreateMemberCenter = createMutationHook<
    IMemberCenter,
    string,
    IMemberCenterRequest
>(
    (data) => MemberCenterService.create(data),
    'New member center created',
    (args) => createMutationInvalidateFn('member-center', args)
)

export const useUpdateMemberCenter = createMutationHook<
    IMemberCenter,
    string,
    { memberCenterId: TEntityId; data: IMemberCenterRequest }
>(
    ({ memberCenterId, data }) =>
        MemberCenterService.updateById(memberCenterId, data),
    'Member center updated',
    (args) => updateMutationInvalidationFn('member-center', args)
)

export const useDeleteMemberCenter = createMutationHook<
    void,
    string,
    TEntityId
>(
    (memberCenterId) => MemberCenterService.deleteById(memberCenterId),
    'Member center deleted',
    (args) => deleteMutationInvalidationFn('member-center', args)
)

export const useFilteredPaginatedMemberCenters = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberCenterPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IMemberCenterPaginated, string>({
        queryKey: [
            'member-center',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterService.search({
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

export const useMemberCenter = ({
    enabled,
    showMessage = true,
}: IAPIHook<IMemberCenter[], string> & IQueryProps = {}) => {
    return useQuery<IMemberCenter[], string>({
        queryKey: ['member-center', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterService.allList()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: [],
        enabled,
        retry: 1,
    })
}

export const useFilteredPaginatedMemberCenter = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberCenterPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IMemberCenterPaginated, string>({
        queryKey: [
            'member-center',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterService.search({
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
