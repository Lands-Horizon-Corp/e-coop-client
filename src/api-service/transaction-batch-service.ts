import APIService from './api-service'

import {
    ITransactionBatch,
    ITransactionBatchDepositInBankRequest,
    ITransactionBatchMinimal,
    TEntityId,
} from '@/types'

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

export const requestTransactionBatchBlotterView = async (id: TEntityId) => {
    const response = await APIService.put<void, ITransactionBatchMinimal>(
        `/transaction-batch/${id}/view-request`
    )
    return response.data
}

export const setDepositInBank = async (id: TEntityId, amount: number) => {
    const response = await APIService.put<
        ITransactionBatchDepositInBankRequest,
        ITransactionBatchMinimal | ITransactionBatch
    >(`/transaction-batch/${id}/deposit-in-bank`, { deposit_in_bank: amount })
    return response.data
}
