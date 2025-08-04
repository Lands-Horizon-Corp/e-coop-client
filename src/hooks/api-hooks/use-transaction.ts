import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import TransactionService from '@/api-service/transaction-service'
import { serverRequestErrExtractor } from '@/helpers'
import { ITransactionPaginated } from '@/types/coop-types/transaction'
import { toBase64, withCatchAsync } from '@/utils'

import { IAPIFilteredPaginatedHook, IQueryProps, TEntityId } from '@/types'

export type TPaginatedTransactionHookMode =
    | 'current-branch' // /transaction/branch/search
    | 'current-user' // /transaction/current/search
    | 'member-profile' // /transaction/member-profile/:member_profile_id/search
    | 'employee' // /transaction/employee/:employee_id/search
    | 'transaction-batch' // /transaction/transaction-batch/:transaction_batch_id/search

export const useFilteredPaginatedTransaction = ({
    mode = 'current-branch',

    userId,
    memberProfileId,
    transactionBatchId,

    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<ITransactionPaginated, string> &
    IQueryProps & {
        mode?: TPaginatedTransactionHookMode

        userId?: TEntityId
        memberProfileId?: TEntityId
        transactionBatchId?: TEntityId
    }) => {
    return useQuery<ITransactionPaginated, string>({
        queryKey: [
            'transaction-tag',
            'resource-query',
            mode,
            memberProfileId,
            userId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            let url = 'branch/search'

            if (mode === 'current-user') url = `current/search`
            else if (mode === 'member-profile')
                url = `member-profile/${transactionBatchId}/search`
            else if (mode === 'employee') url = `employee/${userId}/search`
            else if (mode === 'transaction-batch')
                url = `transaction-batch/${transactionBatchId}/search`

            const [error, result] = await withCatchAsync(
                TransactionService.search({
                    targetUrl: url,
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
