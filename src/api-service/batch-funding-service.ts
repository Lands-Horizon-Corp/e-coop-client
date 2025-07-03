import qs from 'query-string'

import {
    IBatchFunding,
    IBatchFundingPaginated,
    IBatchFundingRequest,
    TEntityId,
} from '@/types'

import APIService from './api-service'

export const createBatchFund = async (data: IBatchFundingRequest) => {
    const response = await APIService.post<IBatchFundingRequest, IBatchFunding>(
        '/batch-funding',
        data
    )
    return response.data
}

export const getAllTransactionBatchFund = async (id: TEntityId) => {
    const response = await APIService.get<IBatchFunding[]>(
        `/batch-funding/transaction-batch/${id}`
    )
    return response.data
}

export const getPaginatedBatchOnlineEntry = async ({
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
            url: `/batch-funding/transaction-batch/${transactionBatchId}/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IBatchFundingPaginated>(url)
    return response.data
}
