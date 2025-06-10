import qs from 'query-string'

import APIService from './api-service'

import { IDepositEntryPaginated, TEntityId } from '@/types'

export const getPaginatedBatchDepositEntry = async ({
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
            url: `/deposit-entry/transaction-batch/${transactionBatchId}/paginated`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IDepositEntryPaginated>(url)
    return response.data
}
