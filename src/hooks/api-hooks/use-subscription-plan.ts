import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import SubscriptionPlanService from '@/api-service/subscription-plan-service'
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
    IAPIHook,
    IQueryProps,
    ISubscriptionPlan,
    ISubscriptionPlanPaginated,
    ISubscriptionPlanRequest,
    TEntityId,
} from '@/types'

export const useCreateSubscriptionPlan = createMutationHook<
    ISubscriptionPlan,
    string,
    ISubscriptionPlanRequest
>(
    (data) => SubscriptionPlanService.create(data),
    'New Tag Template Created',
    (args) => createMutationInvalidateFn('tag-template', args)
)

export const useUpdateSubscriptionPlan = createMutationHook<
    ISubscriptionPlan,
    string,
    { id: TEntityId; data: ISubscriptionPlanRequest }
>(
    ({ id, data }) => SubscriptionPlanService.updateById(id, data),
    'Tag Template Updated',
    (args) => updateMutationInvalidationFn('tag-template', args)
)

export const useDeleteSubscriptionPlan = createMutationHook<
    void,
    string,
    TEntityId
>(
    (id) => SubscriptionPlanService.deleteById(id),
    'Tag Template Deleted',
    (args) => deleteMutationInvalidationFn('tag-template', args)
)

export const useDeleteManySubscriptionPlan = createMutationHook<
    void,
    string,
    TEntityId[]
>((ids) => SubscriptionPlanService.deleteMany(ids), 'Tag Templates Deleted')

export const useSubscriptionPlans = ({
    enabled,
    showMessage = true,
}: IAPIHook<ISubscriptionPlan[], string> & IQueryProps = {}) => {
    return useQuery<ISubscriptionPlan[], string>({
        queryKey: ['tag-template', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                SubscriptionPlanService.allList()
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

export const useFilteredPaginatedSubscriptionPlan = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<ISubscriptionPlanPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<ISubscriptionPlanPaginated, string>({
        queryKey: [
            'tag-template',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                SubscriptionPlanService.search({
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
