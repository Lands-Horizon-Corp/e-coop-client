import {
    createAPICrudService,
    createAPICollectionService,
} from '@/factory/api-factory-service'
import APIService from './api-service'

import {
    TEntityId,
    ITransactionBatch,
    ITransactionBatchMinimal,
    ITransactionBatchRequest,
    TTransactionBatchFullorMin,
    ITransactionBatchEndRequest,
    ITransactionBatchSignatures,
    ITransactionBatchDepositInBankRequest,
} from '@/types'

const CollectionServices =
    createAPICollectionService<ITransactionBatch>('/transaction-batch')

const CrudServices = createAPICrudService<
    ITransactionBatch | ITransactionBatchMinimal,
    ITransactionBatchRequest
>('/transaction-batch')

export const currentTransactionBatch = async () => {
    const response = await APIService.get<
        ITransactionBatchMinimal | ITransactionBatch
    >('/transaction-batch/current')
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

export const { allList, search } = CollectionServices
export const { create, deleteById, deleteMany, getById, updateById } =
    CrudServices

export default {
    endCurrentBatch,
    setDepositInBank,
    allowBlotterView,
    currentTransactionBatch,
    updateEndedBatchApprovals,
    getAllEndedBatchViewRequest,
    getAllTransactionBatchViewRequest,
    requestTransactionBatchBlotterView,
    ...CrudServices,
    ...CollectionServices,
}
