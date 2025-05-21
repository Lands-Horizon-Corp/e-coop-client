import { ITransactionBatchMinimal } from '@/types'
import APIService from './api-service'

import { IIntraBatchFundingRequest } from '@/types/coop-types/intra-batch-funding'

export const currentTransactionBatch = async () => {
    const response = await APIService.get('/transaction-batch/current')
    return response.data
}

export const createTransactionBatch = async (
    data: Omit<IIntraBatchFundingRequest, 'transaction_batch_id'>
) => {
    const response = await APIService.post<
        Omit<IIntraBatchFundingRequest, 'transaction_batch_id'>,
        ITransactionBatchMinimal
    >('/trnsaction-batch', data)
    return response.data
}
