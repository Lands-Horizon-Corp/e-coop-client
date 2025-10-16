import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IFeedback, IFeedbackRequest } from './feedback.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IFeedback,
    IFeedbackRequest
>({
    url: '/api/v1/feedback',
    baseKey: 'feedback',
})

// Export individual hooks
export const {
    useCreate,
    useDeleteById,
    useDeleteMany,
    useGetAll,
    useGetById,
    useGetPaginated,
    useUpdateById,
} = apiCrudHooks

// uncomment to add custom hooks
// export { }

// Export the base API for direct API calls
export const FeedbackAPI = apiCrudService
export const logger = Logger.getInstance('feedback')
