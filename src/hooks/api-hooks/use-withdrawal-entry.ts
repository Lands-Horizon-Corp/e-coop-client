import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as WithdrawalEntryService from '@/api-service/withdrawal-entry-service'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IQueryProps,
    IWithdrawalEntryPaginated,
    TEntityId,
} from '@/types'

export const useFilteredBatchWithdrawalEntry = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    transactionBatchId,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IWithdrawalEntryPaginated, string> &
    IQueryProps & {
        transactionBatchId: TEntityId
    }) => {
    return useQuery<IWithdrawalEntryPaginated, string>({
        queryKey: [
            'withdrawal-entry',
            'transaction-batch',
            transactionBatchId,
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                WithdrawalEntryService.getPaginatedBatchWithdrawalEntry({
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
