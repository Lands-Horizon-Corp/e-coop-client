import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { PaymentTypeServices } from '@/api-service/payment-type-services'
import { serverRequestErrExtractor } from '@/helpers'
import { IAPIFilteredPaginatedHook, IQueryProps } from '@/types/api-hooks-types'
import {
    IPaymentType,
    IPaymentTypePaginatedResource,
    IPaymentTypeRequest,
} from '@/types/coop-types/payment-type'
import { toBase64, withCatchAsync } from '@/utils'

import { TEntityId } from '@/types'

import { createMutationHook } from '../../factory/api-hook-factory'

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
                PaymentTypeServices.getPaginatedPaymentTypes({
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

export const useCreatePaymentType = createMutationHook<
    IPaymentType,
    string,
    IPaymentTypeRequest
>(
    (payload) => PaymentTypeServices.createPaymentType(payload),
    'New Payment Type Created'
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
        PaymentTypeServices.updatePaymentType(
            payload.paymentTypeId,
            payload.data
        ),
    'Payment Type Updated'
)

export const useDeletePaymentType = createMutationHook<void, string, TEntityId>(
    (paymentTypeId) => PaymentTypeServices.deletePaymentType(paymentTypeId),
    'Payment Type Deleted'
)

export const useGetPaymentTypeById = (
    paymentTypeId?: TEntityId,
    showMessage = true
) => {
    return useQuery<IPaymentType, string>({
        queryKey: ['payment_type', paymentTypeId],
        queryFn: async () => {
            if (!paymentTypeId) {
                throw new Error('Payment Type ID is required to fetch details.')
            }
            const [error, result] = await withCatchAsync(
                PaymentTypeServices.getPaymentTypeById(paymentTypeId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        enabled: !!paymentTypeId,
        retry: 1,
    })
}
