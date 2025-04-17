import {
    useQuery,
    useMutation,
    queryOptions,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import MemberOccupationService from '@/server/api-service/member-services/member-occupation-service'

import {
    IAPIHook,
    IQueryProps,
    IMutationProps,
    IOperationCallbacks,
    IAPIFilteredPaginatedHook,
} from '../types'
import {
    TEntityId,
    IMemberOccupationRequest,
    IMemberOccupationResource,
    IMemberOccupationPaginatedResource,
} from '@/server/types'

export const memberOccupationLoader = (
    occupationId: TEntityId,
    preloads: string[] = []
) =>
    queryOptions<IMemberOccupationResource>({
        queryKey: ['member-occupation', 'loader', occupationId],
        queryFn: async () => {
            const data = await MemberOccupationService.getById(
                occupationId,
                preloads
            )
            return data
        },
        retry: 0,
    })

export const useCreateMemberOccupation = ({
    preloads = [],
    showMessage = true,
    onSuccess,
    onError,
}: IAPIHook<IMemberOccupationResource, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberOccupationResource,
        string,
        IMemberOccupationRequest
    >({
        mutationKey: ['member-occupation', 'create'],
        mutationFn: async (data) => {
            const [error, newOccupation] = await withCatchAsync(
                MemberOccupationService.create(data, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-occupation', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['member-occupation', newOccupation.id],
            })
            queryClient.removeQueries({
                queryKey: ['member-occupation', 'loader', newOccupation.id],
            })

            if (showMessage) toast.success('New Member Occupation Created')
            onSuccess?.(newOccupation)

            return newOccupation
        },
    })
}

export const useUpdateMemberOccupation = ({
    preloads = [],
    showMessage = true,
    onSuccess,
    onError,
}: IAPIHook<IMemberOccupationResource, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberOccupationResource,
        string,
        { occupationId: TEntityId; data: IMemberOccupationRequest }
    >({
        mutationKey: ['member-occupation', 'update'],
        mutationFn: async ({ occupationId, data }) => {
            const [error, result] = await withCatchAsync(
                MemberOccupationService.update(occupationId, data, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-occupation', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['member-occupation', occupationId],
            })
            queryClient.removeQueries({
                queryKey: ['member-occupation', 'loader', occupationId],
            })

            if (showMessage) toast.success('Member Occupation updated')
            onSuccess?.(result)

            return result
        },
    })
}

export const useDeleteMemberOccupation = ({
    showMessage = true,
    onError,
    onSuccess,
}: IOperationCallbacks & Omit<IQueryProps, 'enabled'>) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['member-occupation', 'delete'],
        mutationFn: async (occupationId) => {
            const [error] = await withCatchAsync(
                MemberOccupationService.delete(occupationId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-occupation', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['member-occupation', occupationId],
            })
            queryClient.removeQueries({
                queryKey: ['member-occupation', 'loader', occupationId],
            })

            if (showMessage) toast.success('Member Occupation deleted')
            onSuccess?.(undefined)
        },
    })
}

export const useFilteredPaginatedMemberOccupations = ({
    sort,
    enabled,
    showMessage,
    filterPayload,
    preloads = [],
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<
    IMemberOccupationPaginatedResource,
    string
> = {}) => {
    return useQuery<IMemberOccupationPaginatedResource, string>({
        queryKey: [
            'member-occupation',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberOccupationService.getMemberOccupations({
                    preloads,
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
