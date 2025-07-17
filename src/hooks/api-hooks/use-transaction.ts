import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getPaginatedTransactions } from '@/api-service/transaction-service'
import { serverRequestErrExtractor } from '@/helpers'
import { ITransactionPaginated } from '@/types/coop-types/transaction'
import { toBase64, withCatchAsync } from '@/utils'

import { IAPIFilteredPaginatedHook, IQueryProps } from '@/types'

const ENTITY_KEY = 'transaction-tag'

export const useFilteredPaginatedTransaction = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<ITransactionPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<ITransactionPaginated, string>({
        queryKey: [
            ENTITY_KEY,
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                getPaginatedTransactions({
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
