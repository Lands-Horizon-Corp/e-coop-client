import qs from 'query-string'

import APIService from './api-service'

import { TEntityId, ITransactionEntryPaginated } from '@/types'

export const getPaginatedBatchTransactionEntry = async ({
    sort,
    filters,
    pagination,
    transactionBatchId,
}: {
    transactionBatchId: TEntityId
} & {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const url = qs.stringifyUrl(
        {
            url: `/transaction-entry/transaction-batch/${transactionBatchId}/search`,
            query: {
                sort,
                filter: filters,
                pageSize: pagination?.pageSize,
                pageIndex: pagination?.pageIndex,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<ITransactionEntryPaginated>(url)
    return response.data
}
