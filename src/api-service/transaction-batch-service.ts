import APIService from './api-service'

import {
    TEntityId,
    ITransactionBatch,
    ITransactionBatchMinimal,
    TTransactionBatchFullorMin,
    ITransactionBatchEndRequest,
    ITransactionBatchSignatures,
    ITransactionBatchDepositInBankRequest,
} from '@/types'

import { IBatchFundingRequest } from '@/types/coop-types/batch-funding'

export const getTransactionBatchById = async (id: TEntityId) => {
    const response = await APIService.get<ITransactionBatch>(
        `/transaction-batch/${id}`
    )
    return response.data
}

export const currentTransactionBatch = async () => {
    const response = await APIService.get<
        ITransactionBatchMinimal | ITransactionBatch
    >('/transaction-batch/current')
    return response.data
}

export const createTransactionBatch = async (
    data: Omit<IBatchFundingRequest, 'transaction_batch_id'>
) => {
    const response = await APIService.post<
        Omit<IBatchFundingRequest, 'transaction_batch_id'>,
        ITransactionBatchMinimal
    >('/trnsaction-batch', data)
    return response.data
}

// Create TransactionBatch -> id
// TransactionBatch Funding

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

export const endCurrentBatch = async (data: ITransactionBatchEndRequest) => {
    const response = await APIService.put<
        ITransactionBatchEndRequest,
        TTransactionBatchFullorMin
    >(`/transaction-batch/end`, data)
    return response.data
}

export const getAllTransactionBatchViewRequest = async () => {
    const response = await APIService.get<ITransactionBatch[]>(
        '/transaction-batch/view-request'
    )
    return response.data
}

export const allowBlotterView = async (id: TEntityId) => {
    const response = await APIService.put<void, ITransactionBatch>(
        `/transaction-batch/${id}/view-accept`
    )
    return response.data
}

export const getAllEndedBatchViewRequest = async () => {
    const response = await APIService.get<ITransactionBatch[]>(
        '/transaction-batch/view-approval'
    )
    return response.data
}

export const updateEndedBatchApprovals = async (
    id: TEntityId,
    data: ITransactionBatchSignatures
) => {
    const response = await APIService.put<
        ITransactionBatchSignatures,
        ITransactionBatch
    >(`/transaction-batch/${id}/view-accept`, data)
    return response.data
}
