import {
    useQuery,
    useMutation,
    queryOptions,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import MemberEducationalAttainmentService from '@/api-service/member-services/member-educational-attainment-service'

import {
    IAPIHook,
    IQueryProps,
    IMutationProps,
    IOperationCallbacks,
    IAPIFilteredPaginatedHook,
} from '../types'
import {
    TEntityId,
    IMemberEducationalAttainmentRequest,
    IMemberEducationalAttainmentResource,
    IMemberEducationalAttainmentPaginatedResource,
} from '@/types/coop-types'

export const memberEducationalAttainmentLoader = (
    attainmentId: TEntityId,
    preloads: string[] = []
) =>
    queryOptions<IMemberEducationalAttainmentResource>({
        queryKey: ['member-educational-attainment', 'loader', attainmentId],
        queryFn: async () => {
            const data = await MemberEducationalAttainmentService.getById(
                attainmentId,
                preloads
            )
            return data
        },
        retry: 0,
    })

export const useCreateMemberEducationalAttainment = ({
    preloads = [],
    showMessage = true,
    onSuccess,
    onError,
}: IAPIHook<IMemberEducationalAttainmentResource, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberEducationalAttainmentResource,
        string,
        IMemberEducationalAttainmentRequest
    >({
        mutationKey: ['member-educational-attainment', 'create'],
        mutationFn: async (data) => {
            const [error, newAttainment] = await withCatchAsync(
                MemberEducationalAttainmentService.create(data, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-educational-attainment', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['member-educational-attainment', newAttainment.id],
            })
            queryClient.removeQueries({
                queryKey: [
                    'member-educational-attainment',
                    'loader',
                    newAttainment.id,
                ],
            })

            if (showMessage)
                toast.success('New Member Educational Attainment Created')
            onSuccess?.(newAttainment)

            return newAttainment
        },
    })
}

export const useUpdateMemberEducationalAttainment = ({
    preloads = [],
    showMessage = true,
    onSuccess,
    onError,
}: IAPIHook<IMemberEducationalAttainmentResource, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberEducationalAttainmentResource,
        string,
        { attainmentId: TEntityId; data: IMemberEducationalAttainmentRequest }
    >({
        mutationKey: ['member-educational-attainment', 'update'],
        mutationFn: async ({ attainmentId, data }) => {
            const [error, result] = await withCatchAsync(
                MemberEducationalAttainmentService.update(
                    attainmentId,
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
                queryKey: ['member-educational-attainment', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['member-educational-attainment', attainmentId],
            })
            queryClient.removeQueries({
                queryKey: [
                    'member-educational-attainment',
                    'loader',
                    attainmentId,
                ],
            })

            if (showMessage)
                toast.success('Member Educational Attainment updated')
            onSuccess?.(result)

            return result
        },
    })
}

export const useDeleteMemberEducationalAttainment = ({
    showMessage = true,
    onError,
    onSuccess,
}: IOperationCallbacks & Omit<IQueryProps, 'enabled'>) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['member-educational-attainment', 'delete'],
        mutationFn: async (attainmentId) => {
            const [error] = await withCatchAsync(
                MemberEducationalAttainmentService.delete(attainmentId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-educational-attainment', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['member-educational-attainment', attainmentId],
            })
            queryClient.removeQueries({
                queryKey: [
                    'member-educational-attainment',
                    'loader',
                    attainmentId,
                ],
            })

            if (showMessage)
                toast.success('Member Educational Attainment deleted')
            onSuccess?.(undefined)
        },
    })
}

export const useFilteredPaginatedMemberEducationalAttainments = ({
    sort,
    enabled,
    showMessage,
    filterPayload,
    preloads = [],
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<
    IMemberEducationalAttainmentPaginatedResource,
    string
> = {}) => {
    return useQuery<IMemberEducationalAttainmentPaginatedResource, string>({
        queryKey: [
            'member-educational-attainment',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberEducationalAttainmentService.getMemberEducationalAttainments(
                    {
                        preloads,
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
