import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as MemberTypeReferenceService from '@/api-service/member-services/member-type/member-type-reference-service'

import {
    IAPIHook,
    TEntityId,
    IQueryProps,
    IMutationProps,
    IMemberTypeReference,
    IAPIFilteredPaginatedHook,
    IMemberTypeReferenceRequest,
    IMemberTypeReferencePaginated,
} from '@/types'

export const useCreateMemberTypeReference = ({
    preloads = [],
    showMessage = true,
    onSuccess,
    onError,
}:
    | undefined
    | (IAPIHook<IMemberTypeReference, string> & IMutationProps) = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberTypeReference,
        string,
        IMemberTypeReferenceRequest
    >({
        mutationKey: ['member-type-reference', 'create'],
        mutationFn: async (data) => {
            const [error, newMemberTypeReference] = await withCatchAsync(
                MemberTypeReferenceService.createMemberTypeReference(
                    data,
                    preloads
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: [
                    'member-type-reference',
                    data.member_type_id,
                    'resource-query',
                ],
            })

            queryClient.invalidateQueries({
                queryKey: ['member-type-reference', data.member_type_id],
            })

            if (showMessage) toast.success('New Member Type Reference Created')
            onSuccess?.(newMemberTypeReference)

            return newMemberTypeReference
        },
    })
}

export const useUpdateMemberTypeReference = ({
    showMessage = true,
    preloads = ['Owner', 'Media', 'Owner.Media'],
    onSuccess,
    onError,
}: IAPIHook<IMemberTypeReference, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        void,
        string,
        { memberTypeReferenceId: TEntityId; data: IMemberTypeReferenceRequest }
    >({
        mutationKey: ['member-type-reference', 'update'],
        mutationFn: async ({ memberTypeReferenceId, data }) => {
            const [error, result] = await withCatchAsync(
                MemberTypeReferenceService.updateMemberTypeReference(
                    memberTypeReferenceId,
                    data,
                    preloads
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: [
                    'member-type-reference',
                    data.member_type_id,
                    'resource-query',
                ],
            })

            queryClient.invalidateQueries({
                queryKey: ['member-type-reference', memberTypeReferenceId],
            })

            queryClient.removeQueries({
                queryKey: [
                    'member-type-reference',
                    'loader',
                    memberTypeReferenceId,
                ],
            })

            if (showMessage) toast.success('Member Type Reference updated')
            onSuccess?.(result)
        },
    })
}

export const useFilteredPaginatedMemberTypeReferences = ({
    sort,
    enabled,
    memberTypeId,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberTypeReferencePaginated, string> & {
    memberTypeId: TEntityId
} & IQueryProps) => {
    return useQuery<IMemberTypeReferencePaginated, string>({
        queryKey: [
            'member-type-reference',
            memberTypeId,
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberTypeReferenceService.getPaginatedMemberTypeReferences({
                    preloads,
                    pagination,
                    memberTypeId,
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
