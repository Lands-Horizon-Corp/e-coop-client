import APIService from './api-service'

import {
    TEntityId,
    ITransactionBatch,
    ITransactionBatchMinimal,
    ITransactionBatchDepositInBankRequest,
} from '@/types'

import { IIntraBatchFundingRequest } from '@/types/coop-types/intra-batch-funding'

export const currentTransactionBatch = async () => {
    const response = await APIService.get<
        ITransactionBatchMinimal | ITransactionBatch
    >('/transaction-batch/current')
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

export const setDepositInBank = async (
    id: TEntityId,
    data: ITransactionBatchDepositInBankRequest
) => {
    const response = await APIService.put<
        ITransactionBatchDepositInBankRequest,
        ITransactionBatchMinimal | ITransactionBatch
    >(`/transaction-batch/${id}/deposit-in-bank`, data)
    return response.data
}
