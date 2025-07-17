import { queryOptions, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import MemberTypeService from '@/api-service/member-services/member-type/member-type-service'
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
    IMemberType,
    IMemberTypePaginated,
    IMemberTypeRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const memberTypeLoader = (memberTypeId: TEntityId) =>
    queryOptions<IMemberType>({
        queryKey: ['member-type', 'loader', memberTypeId],
        queryFn: async () => {
            const data = await MemberTypeService.getById(memberTypeId)
            return data
        },
        retry: 0,
    })

export const useCreateMemberType = createMutationHook<
    IMemberType,
    string,
    IMemberTypeRequest
>(
    (data) => MemberTypeService.create(data),
    'New Member Type Created',
    (args) => createMutationInvalidateFn('member-type', args)
)

export const useUpdateMemberType = createMutationHook<
    IMemberType,
    string,
    { memberTypeId: TEntityId; data: IMemberTypeRequest }
>(
    ({ memberTypeId, data }) =>
        MemberTypeService.updateById(memberTypeId, data),
    'Member Type updated',
    (args) => updateMutationInvalidationFn('member-type', args)
)

export const useDeleteMemberType = createMutationHook<void, string, TEntityId>(
    (memberTypeId) => MemberTypeService.deleteById(memberTypeId),
    'Member Type deleted',
    (args) => deleteMutationInvalidationFn('member-type', args)
)

export const useMemberTypes = ({
    enabled,
    showMessage,
}: IAPIHook<IMemberType[], string> & IQueryProps = {}) => {
    return useQuery<IMemberType[], string>({
        queryKey: ['member-classification', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberTypeService.allList()
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

export const useFilteredPaginatedMemberTypes = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberTypePaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IMemberTypePaginated, string>({
        queryKey: [
            'member-type',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberTypeService.search({
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
