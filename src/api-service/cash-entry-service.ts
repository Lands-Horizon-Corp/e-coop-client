import qs from 'query-string'
import { TEntityId } from '@/types'
import APIService from './api-service'
import { ICashEntryPaginated } from '@/types/coop-types/cash-entry'

export const getPaginatedBatchCashEntry = async ({
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
            url: `/cash-entry/transaction-batch/${transactionBatchId}/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<ICashEntryPaginated>(url)
    return response.data
}
