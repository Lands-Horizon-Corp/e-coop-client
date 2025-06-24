import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import BillsAndCoinService from '@/api-service/bills-and-coins-service'

import {
    IAPIHook,
    TEntityId,
    IQueryProps,
    IBillsAndCoin,
    IBillsAndCoinRequest,
    IBillsAndCoinPaginated,
    IAPIFilteredPaginatedHook,
} from '@/types'

export const useCreateBillsAndCoin = createMutationHook<
    IBillsAndCoin,
    string,
    IBillsAndCoinRequest
>(
    (data) => BillsAndCoinService.create(data),
    'New Bill/Coin Created',
    (args) => createMutationInvalidateFn('bills-and-coin', args)
)

export const useUpdateBillsAndCoin = createMutationHook<
    IBillsAndCoin,
    string,
    { id: TEntityId; data: IBillsAndCoinRequest }
>(
    ({ id, data }) => BillsAndCoinService.updateById(id, data),
    'New Bill/Coin Created',
    (args) => updateMutationInvalidationFn('bills-and-coin', args)
)

export const useDeleteBillsAndCoins = createMutationHook<
    void,
    string,
    TEntityId
>(
    (id) => BillsAndCoinService.deleteById(id),
    'Bills and coins deleted',
    (args) => deleteMutationInvalidationFn('bills-and-coin', args)
)

export const useDeleteManyBillsAndCoins = createMutationHook<
    void,
    string,
    TEntityId[]
>((ids) => BillsAndCoinService.deleteMany(ids), 'Bills and coins deleted')

export const useBillsAndCoins = ({
    enabled,
    showMessage = true,
}: IAPIHook<IBillsAndCoin[], string> & IQueryProps = {}) => {
    return useQuery<IBillsAndCoin[], string>({
        queryKey: ['bills-and-coin', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                BillsAndCoinService.allList()
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

export const useFilteredPaginatedBillsAndCoin = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IBillsAndCoinPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IBillsAndCoinPaginated, string>({
        queryKey: [
            'bills-and-coin',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                BillsAndCoinService.search({
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
