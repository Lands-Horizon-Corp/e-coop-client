import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as CashEntryService from '@/api-service/cash-entry-service'

import {
    TEntityId,
    IQueryProps,
    ICashEntryPaginated,
    IAPIFilteredPaginatedHook,
} from '@/types'

export const useFilteredBatchCashEntry = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
    showMessage = true,
    transactionBatchId,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<ICashEntryPaginated, string> &
    IQueryProps & {
        transactionBatchId: TEntityId
    }) => {
    return useQuery<ICashEntryPaginated, string>({
        queryKey: [
            'cash-entry',
            'transaction-batch',
            transactionBatchId,
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                CashEntryService.getPaginatedBatchCashEntry({
                    preloads,
                    pagination,
                    transactionBatchId,
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
            totalSize: 5,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}
