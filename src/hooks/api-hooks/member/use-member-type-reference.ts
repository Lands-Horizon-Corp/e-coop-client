import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import MemberTypeReferenceService from '@/api-service/member-services/member-type/member-type-reference-service'
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
    IMemberTypeReference,
    IMemberTypeReferencePaginated,
    IMemberTypeReferenceRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useCreateMemberTypeReference = createMutationHook<
    IMemberTypeReference,
    string,
    IMemberTypeReferenceRequest
>(
    (data) => MemberTypeReferenceService.create(data),
    'Member type reference created',
    (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [
                'member-type-reference',
                'member-type-id',
                args.payload.member_type_id,
            ],
        })
        createMutationInvalidateFn('member-type-reference', args)
    }
)

export const useUpdateMemberTypeReference = createMutationHook<
    IMemberTypeReference,
    string,
    { memberTypeReferenceId: TEntityId; data: IMemberTypeReferenceRequest }
>(
    ({ memberTypeReferenceId, data }) =>
        MemberTypeReferenceService.updateById(memberTypeReferenceId, data),
    'Member type reference updated',
    (args) => {
        updateMutationInvalidationFn('member-type-reference', args)
        args.queryClient.invalidateQueries({
            queryKey: [
                'member-type-reference',
                'member-type-id',
                args.payload.data.member_type_id,
            ],
        })
    }
)

export const useDeleteMemberTypeReference = createMutationHook<
    void,
    string,
    TEntityId
>(
    (memberTypeReferenceId) =>
        MemberTypeReferenceService.deleteById(memberTypeReferenceId),
    'Member Type reference deleted',
    (args) => {
        deleteMutationInvalidationFn('member-type-reference', args)
        args.queryClient.invalidateQueries({
            queryKey: ['member-type-reference', 'member-type-id'],
        })
    }
)

export type TMemberTypeReferenceFetchMode = 'all' | 'specific'

export const useFilteredPaginatedMemberTypeReference = ({
    memberTypeId,
    mode = 'all',
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberTypeReferencePaginated, string> &
    IQueryProps & {
        memberTypeId?: TEntityId
        mode?: TMemberTypeReferenceFetchMode
    }) => {
    return useQuery<IMemberTypeReferencePaginated, string>({
        queryKey: [
            'member-type-reference',
            'member-type-id',
            memberTypeId,
            'resource-query',
            mode,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberTypeReferenceService.search({
                    targetUrl:
                        memberTypeId !== undefined && mode === 'specific'
                            ? `member-type/${memberTypeId}/search`
                            : undefined,
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
