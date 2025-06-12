import {
    useQuery,
    useMutation,
    queryOptions,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as MemberClassificationService from '@/api-service/member-services/member-classification-service'

import {
    IAPIHook,
    TEntityId,
    IQueryProps,
    IMutationProps,
    IOperationCallbacks,
    IMemberClassification,
    IAPIFilteredPaginatedHook,
    IMemberClassificationRequest,
    IMemberClassificationPaginated,
} from '@/types'

export const memberClassificationLoader = (classificationId: TEntityId) =>
    queryOptions<IMemberClassification>({
        queryKey: ['member-classification', 'loader', classificationId],
        queryFn: async () => {
            const data =
                await MemberClassificationService.getMemberClassificationById(
                    classificationId
                )
            return data
        },
        retry: 0,
    })

export const useCreateMemberClassification = ({
    showMessage = true,
    onSuccess,
    onError,
}: IAPIHook<IMemberClassification, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberClassification,
        string,
        IMemberClassificationRequest
    >({
        mutationKey: ['member-classification', 'create'],
        mutationFn: async (data) => {
            const [error, newClassification] = await withCatchAsync(
                MemberClassificationService.createMemberClassification(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-classification', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['member-classification', newClassification.id],
            })
            queryClient.removeQueries({
                queryKey: [
                    'member-classification',
                    'loader',
                    newClassification.id,
                ],
            })

            if (showMessage) toast.success('New Member Classification Created')
            onSuccess?.(newClassification)

            return newClassification
        },
    })
}

export const useUpdateMemberClassification = ({
    showMessage = true,
    onSuccess,
    onError,
}: IAPIHook<IMemberClassification, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberClassification,
        string,
        { classificationId: TEntityId; data: IMemberClassificationRequest }
    >({
        mutationKey: ['member-classification', 'update'],
        mutationFn: async ({ classificationId, data }) => {
            const [error, result] = await withCatchAsync(
                MemberClassificationService.updateMemberClassification(
                    classificationId,
                    data
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-classification', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['member-classification', classificationId],
            })
            queryClient.removeQueries({
                queryKey: ['member-classification', 'loader', classificationId],
            })

            if (showMessage) toast.success('Member Classification updated')
            onSuccess?.(result)

            return result
        },
    })
}

export const useDeleteMemberClassification = ({
    showMessage = true,
    onError,
    onSuccess,
}: IOperationCallbacks & Omit<IQueryProps, 'enabled'>) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['member-classification', 'delete'],
        mutationFn: async (classificationId) => {
            const [error] = await withCatchAsync(
                MemberClassificationService.deleteMemberClassification(
                    classificationId
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-classification', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['member-classification', classificationId],
            })
            queryClient.removeQueries({
                queryKey: ['member-classification', 'loader', classificationId],
            })

            if (showMessage) toast.success('Member Classification deleted')
            onSuccess?.(undefined)
        },
    })
}

export const useFilteredPaginatedMemberClassifications = ({
    sort,
    enabled,
    showMessage,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberClassificationPaginated, string> = {}) => {
    return useQuery<IMemberClassificationPaginated, string>({
        queryKey: [
            'member-classification',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberClassificationService.getPaginatedMemberClassifications({
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

export const useMemberClassifications = ({
    enabled,
    showMessage,
}: IAPIHook<IMemberClassification[], string> & IQueryProps = {}) => {
    return useQuery<IMemberClassification[], string>({
        queryKey: ['member-classification', 'resource-query', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberClassificationService.getMemberClassifications()
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
