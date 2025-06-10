import { queryOptions } from '@tanstack/react-query'

import { toBase64 } from '@/utils'
import { createQueryHook, createMutationHook } from '../api-hook-factory'
import * as MemberTypeService from '@/api-service/member-services/member-type/member-type-service'

import {
    IAPIHook,
    TEntityId,
    IMemberType,
    IQueryProps,
    IMemberTypeRequest,
    IMemberTypePaginated,
    IFilterPaginatedHookProps,
} from '@/types'

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

export const useFilteredPaginatedMemberTypes = createQueryHook<
    IMemberTypePaginated,
    string,
    IFilterPaginatedHookProps & IQueryProps
>(
    ['member-type', 'resource-query'],
    (variables) =>
        MemberTypeService.getPaginatedMemberTypes({
            pagination: variables?.pagination ?? { pageSize: 10, pageIndex: 1 },
            sort: variables?.sort ? toBase64(variables.sort) : undefined,
            filters: variables?.filterPayload
                ? toBase64(variables.filterPayload)
                : undefined,
        }),
    {
        data: [],
        pages: [],
        totalSize: 0,
        totalPage: 0,
        pageIndex: 0,
        pageSize: 0,
    }
)
