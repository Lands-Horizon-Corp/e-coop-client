import qs from 'query-string'

import APIService from './api-service'

import { TEntityId, ITransactionEntryPaginated } from '@/types'

export const getPaginatedBatchTransactionEntry = async ({
    sort,
    filters,
    preloads,
    pagination,
    transactionBatchId,
}: {
    transactionBatchId: TEntityId
} & {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const url = qs.stringifyUrl(
        {
            url: `/transaction-entry/transaction-batch/${transactionBatchId}/paginated`,
            query: {
                sort,
                preloads,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<ITransactionEntryPaginated>(url)
    return response.data
}
