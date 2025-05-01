import {
    useQuery,
    useMutation,
    queryOptions,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    createFeedback,
    deleteFeedback,
    getFeedbackById,
    getPaginatedFeedbacks,
} from '@/api-service/feedback-service'
import { withCatchAsync, toBase64 } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'

import {
    IAPIPreloads,
    IOperationCallbacks,
    IFilterPaginatedHookProps,
} from './types'
import {
    TEntityId,
    IFeedback,
    IFeedbackRequest,
    IFeedbackPaginated,
} from '@/types'

// Only used by path preloader
export const feedbackLoader = (feedbackId: TEntityId) =>
    queryOptions<IFeedback>({
        queryKey: ['feedback', 'loader', feedbackId],
        queryFn: async () => {
            const data = await getFeedbackById(feedbackId, ['User'])
            return data
        },
        retry: 0,
    })

// Load/get feedback by id
export const useFeedback = ({
    feedbackId,
    preloads = ['User'],
    onError,
    onSuccess,
}: { feedbackId: TEntityId } & IAPIPreloads &
    IOperationCallbacks<IFeedback, string>) => {
    return useQuery<IFeedback, string>({
        queryKey: ['feedback', feedbackId],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                getFeedbackById(feedbackId, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(data)
            return data
        },
        enabled: feedbackId !== undefined && feedbackId !== null,
    })
}

// Create feedback
export const useCreateFeedback = ({
    onError,
    onSuccess,
}: IOperationCallbacks<IFeedback>) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, IFeedbackRequest>({
        mutationKey: ['feedback', 'create'],
        mutationFn: async (feedbackData) => {
            const [error, data] = await withCatchAsync(
                createFeedback(feedbackData)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['feedback', 'resource-query'],
            })

            toast.success('Feedback Created')
            onSuccess?.(data)
        },
    })
}

// Delete feedback
export const useDeleteFeedback = ({
    onError,
    onSuccess,
}: IOperationCallbacks) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['feedback', 'delete'],
        mutationFn: async (feedbackId) => {
            const [error] = await withCatchAsync(deleteFeedback(feedbackId))

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw new Error(errorMessage)
            }

            queryClient.invalidateQueries({
                queryKey: ['feedback', 'resource-query'],
            })

            toast.success('Feedback Deleted')
            onSuccess?.(undefined)
        },
    })
}

// feedbacks with pagination, filter, sort
export const useFilteredPaginatedFeedbacks = ({
    sort,
    filterPayload,
    preloads = ['User'],
    pagination = { pageSize: 10, pageIndex: 1 },
}: IFilterPaginatedHookProps = {}) => {
    return useQuery<IFeedbackPaginated, string>({
        queryKey: [
            'feedback',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                getPaginatedFeedbacks({
                    preloads,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
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
        retry: 1,
    })
}
