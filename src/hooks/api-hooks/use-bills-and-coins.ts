import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import { createMutationHook } from './api-hook-factory'
import * as BillsAndCoinService from '@/api-service/bills-and-coins-service'

import {
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
    (data) => BillsAndCoinService.createBillsCoin(data),
    'New Member Type Created'
)

export const useUpdateBillsAndCoin = createMutationHook<
    IBillsAndCoin,
    string,
    { id: TEntityId; data: IBillsAndCoinRequest }
>(
    ({ id, data }) => BillsAndCoinService.updateBillsCoin(id, data),
    'Member Type updated'
)

export const useDeleteBillsAndCoins = createMutationHook<
    void,
    string,
    TEntityId
>((id) => BillsAndCoinService.deleteBillsAndCoin(id), 'Bills and coins deleted')

export const useDeleteManyBillsAndCoins = createMutationHook<
    void,
    string,
    TEntityId[]
>(
    (ids) => BillsAndCoinService.deleteManyBillsAndCoin(ids),
    'Bills and coins deleted'
)

export const useFilteredPaginatedBillsAndCoin = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
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
                BillsAndCoinService.getPaginatedBillsAndCoins({
                    preloads,
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
