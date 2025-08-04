import qs from 'query-string'

import { IWithdrawalEntryPaginated, TEntityId } from '@/types'

import APIService from './api-service'

export const getPaginatedBatchWithdrawalEntry = async ({
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
            url: `/api/v1/withdrawal-entry/transaction-batch/${transactionBatchId}/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IWithdrawalEntryPaginated>(url)
    return response.data
}
