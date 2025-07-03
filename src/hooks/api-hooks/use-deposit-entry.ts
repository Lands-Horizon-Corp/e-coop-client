import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as DepositEntryService from '@/api-service/deposit-entry-service'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IDepositEntryPaginated,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useFilteredBatchDepositEntry = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    transactionBatchId,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IDepositEntryPaginated, string> &
    IQueryProps & {
        transactionBatchId: TEntityId
    }) => {
    return useQuery<IDepositEntryPaginated, string>({
        queryKey: [
            'deposit-entry',
            'transaction-batch',
            transactionBatchId,
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                DepositEntryService.getPaginatedBatchDepositEntry({
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
