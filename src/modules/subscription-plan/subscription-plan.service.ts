import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions } from '@/types'

import { getCurrentCurrencyByTimezone } from '../currency'
import type {
    ISubscriptionPlan,
    ISubscriptionPlanRequest,
    TSubscriptionPlanMode,
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

export const {
    API, // rarely used, for raw calls
    route: subscriptionAPIRoute, // matches url above

    create: createSubscription,
    updateById: updateSubscriptionById,

    deleteById: deleteSubscriptionById,
    deleteMany: deleteManySubscription,

    getById: getSubscriptionById,
    getAll: getAllSubscription,
    getPaginated: getPaginatedSubscription,
} = apiCrudService

export const useGetAllSubscriptionPlans = ({
    query,
    mode = 'all',
    options,
}: {
    query?: TAPIQueryOptions
    mode?: TSubscriptionPlanMode
    options?: HookQueryOptions<ISubscriptionPlan[], Error>
}) => {
    return useQuery<ISubscriptionPlan[], Error>({
        ...options,
        queryKey: ['subscription-plan', mode, query].filter(Boolean),
        queryFn: async () => {
            let url = '/api/v1/subscription-plan'

            if (mode === 'timezone') {
                const currency = await getCurrentCurrencyByTimezone()
                url = `${url}/currency/${encodeURIComponent(currency.id)}`
            }
            return getAllSubscription({
                query,
                url,
            })
        },
    })
}

export const logger = Logger.getInstance('subscription-plan')
