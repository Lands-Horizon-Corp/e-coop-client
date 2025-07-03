import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as TransactionEntryService from '@/api-service/transaction-entry-service'
import { createMutationHook } from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IQueryProps,
    ITransactionEntry,
    ITransactionEntryPaginated,
    ITransactionEntryRequest,
    TEntityId,
} from '@/types'

export const useFilteredBatchTransactionEntry = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    transactionBatchId,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<ITransactionEntryPaginated, string> &
    IQueryProps & {
        transactionBatchId: TEntityId
    }) => {
    return useQuery<ITransactionEntryPaginated, string>({
        queryKey: [
            'transaction-entry',
            'transaction-batch',
            transactionBatchId,
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TransactionEntryService.getPaginatedBatchTransactionEntry({
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

export const useCreateTransactionEntry = createMutationHook<
    ITransactionEntry,
    string,
    ITransactionEntryRequest
>(
    (payload) => TransactionEntryService.createTransactionEntry(payload),
    'Successfully sumit Payment entry'
)
