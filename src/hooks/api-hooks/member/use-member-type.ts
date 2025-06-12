import { queryOptions, useQuery } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { createQueryHook, createMutationHook } from '../api-hook-factory'
import * as MemberTypeService from '@/api-service/member-services/member-type/member-type-service'

import {
    IAPIHook,
    TEntityId,
    IMemberType,
    IQueryProps,
    IMemberTypeRequest,
    IMemberTypePaginated,
    IAPIFilteredPaginatedHook,
} from '@/types'
import { serverRequestErrExtractor } from '@/helpers'
import { toast } from 'sonner'

export const memberTypeLoader = (memberTypeId: TEntityId) =>
    queryOptions<IMemberType>({
        queryKey: ['member-type', 'loader', memberTypeId],
        queryFn: async () => {
            const data = await MemberTypeService.getMemberTypeById(memberTypeId)
            return data
        },
        retry: 0,
    })

export const useCreateMemberType = createMutationHook<
    IMemberType,
    string,
    IMemberTypeRequest
>((data) => MemberTypeService.createMemberType(data), 'New Member Type Created')

export const useUpdateMemberType = createMutationHook<
    IMemberType,
    string,
    { memberTypeId: TEntityId; data: IMemberTypeRequest }
>(
    ({ memberTypeId, data }) =>
        MemberTypeService.updateMemberType(memberTypeId, data),
    'Member Type updated'
)

export const useDeleteMemberType = createMutationHook<void, string, TEntityId>(
    (memberTypeId) => MemberTypeService.deleteMemberType(memberTypeId),
    'Member Type deleted'
)

export const useMemberTypes = createQueryHook<
    IMemberType[],
    string,
    IQueryProps & IAPIHook<IMemberType[]>
>(['member-type', 'all'], () => MemberTypeService.getAllMemberTypes(), [])

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
                MemberTypeService.getPaginatedMemberTypes({
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
