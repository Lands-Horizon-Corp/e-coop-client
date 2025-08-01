import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import CashCountService from '@/api-service/cash-count-service'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    ICashCount,
    ICashCountBatchRequest,
    ICashCountPaginated,
    IQueryProps,
} from '@/types'

import { createMutationHook } from '../../factory/api-hook-factory'

export const useCurrentBatchCashCounts = ({
    enabled,
    showMessage = true,
}: IAPIHook<ICashCount[], string> & IQueryProps = {}) => {
    return useQuery<ICashCount[], string>({
        queryKey: ['cash-count', 'transaction-batch', 'current'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                CashCountService.getCurrentBatchCashCounts()
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

export const useUpdateBatchCashCounts = createMutationHook<
    ICashCount[],
    string,
    ICashCountBatchRequest
>(
    (data) => CashCountService.updateBatchCashCount(data),
    'Batch cash count updated'
)

export const useFilteredPaginatedCashCount = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<ICashCountPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<ICashCountPaginated, string>({
        queryKey: [
            'cash-count',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                CashCountService.search({
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
