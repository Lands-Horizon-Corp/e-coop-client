import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import PaymentTypeServices from '@/api-service/payment-type'
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
    IPaymentType,
    IPaymentTypePaginatedResource,
    IPaymentTypeRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

const KEY = 'payment_type'

export const useCreatePaymentType = createMutationHook<
    IPaymentType,
    string,
    IPaymentTypeRequest
>(
    (payload) => PaymentTypeServices.create(payload),
    'Payment Type Created',
    (args) => createMutationInvalidateFn(KEY, args)
)

export const useUpdatePaymentType = createMutationHook<
    IPaymentType,
    string,
    {
        paymentTypeId: TEntityId
        data: IPaymentTypeRequest
    }
>(
    (payload) =>
        PaymentTypeServices.updateById(payload.paymentTypeId, payload.data),
    'Payment Type Updated',
    (args) => updateMutationInvalidationFn(KEY, args)
)

export const useDeletePaymentType = createMutationHook<void, string, TEntityId>(
    (paymentTypeId) => PaymentTypeServices.deleteById(paymentTypeId),
    'Payment Type Deleted',
    (args) => deleteMutationInvalidationFn(KEY, args)
)

export const useDeletePaymentTypesBulk = createMutationHook<
    void,
    string,
    TEntityId[]
>(
    (paymentTypeIds) => PaymentTypeServices.deleteMany(paymentTypeIds),
    'Payment Types Deleted',
    (args) => deleteMutationInvalidationFn(KEY, args)
)

export const useFilteredPaginatedPaymentType = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IPaymentTypePaginatedResource, string> &
    IQueryProps = {}) => {
    return useQuery<IPaymentTypePaginatedResource, string>({
        queryKey: [
            'payment_type',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                PaymentTypeServices.search({
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
