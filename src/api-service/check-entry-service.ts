import qs from 'query-string'

import APIService from './api-service'

import { ICheckEntryPaginated, TEntityId } from '@/types'

export const getPaginatedBatchCheckEntry = async ({
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
            url: `/check-entry/transaction-batch/${transactionBatchId}/paginated`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<ICheckEntryPaginated>(url)
    return response.data
}
