import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    ISubscriptionPlan,
    ISubscriptionPlanRequest,
} from './subscription-plan.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    ISubscriptionPlan,
    ISubscriptionPlanRequest
>({
    url: '/api/v1/subscription-plan',
    baseKey: 'subscription-plan',
})

// Export CRUD hooks
export const {
    useCreate,
    useDeleteById,
    useDeleteMany,
    useGetAll,
    useGetById,
    useGetPaginated,
    useUpdateById,
} = apiCrudHooks

// Export the base API for direct API calls
export const SubscriptionPlanAPI = apiCrudService

export const logger = Logger.getInstance('subscription-plan')
