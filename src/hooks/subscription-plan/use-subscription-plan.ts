import { SubscriptionPlanService } from '@/api-service/subscription-plan-services'
import { serverRequestErrExtractor } from '@/helpers'
import {
    IOperationCallbacks,
    ISubscriptionPlan,
    ISubscriptionPlanRequest,
    TEntityId,
} from '@/types'
import { withCatchAsync } from '@/utils'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useSubscriptionPlan = () => {
    return useQuery<ISubscriptionPlan[], string>({
        queryKey: ['subscription-plan', 'resource-query'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                SubscriptionPlanService.getALLSubscriptionPlans()
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
    })
}
export const useCreateSubscriptionPlan = ({
    onSuccess,
}: IOperationCallbacks<ISubscriptionPlan>) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, ISubscriptionPlanRequest>({
        mutationKey: ['subscription-plan', 'create'],
        mutationFn: async (subscriptionPlanData) => {
            const [error, data] = await withCatchAsync(
                SubscriptionPlanService.createSubscriptionPlan(
                    subscriptionPlanData
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['subscription-plan', 'resource-query'],
            })

            toast.success('Subscription Plan Created')
            onSuccess?.(data)
        },
    })
}

export const useUpdateSubscriptionPlan = ({
    onSuccess,
}: IOperationCallbacks<ISubscriptionPlan>) => {
    const queryClient = useQueryClient()

    return useMutation<
        ISubscriptionPlan,
        string,
        { subscriptionPlanId: TEntityId; data: ISubscriptionPlanRequest }
    >({
        mutationKey: ['subscription-plan', 'update'],
        mutationFn: async ({ subscriptionPlanId, data }) => {
            const [error, result] = await withCatchAsync(
                SubscriptionPlanService.updateSubscriptionPlan(
                    subscriptionPlanId,
                    data
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['subscription-plan', 'resource-query'],
            })

            toast.success('Subscription Plan Updated')
            onSuccess?.(result)
            return result
        },
    })
}
export const useDeleteSubscriptionPlan = ({
    onSuccess,
}: IOperationCallbacks = {}) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['subscription-plan', 'delete'],
        mutationFn: async (subscriptionPlanId) => {
            const [error] = await withCatchAsync(
                SubscriptionPlanService.deleteSubscriptionPlan(
                    subscriptionPlanId
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['subscription-plan', 'resource-query'],
            })

            toast.success('Subscription Plan Deleted')
            onSuccess?.(undefined)
        },
    })
}
