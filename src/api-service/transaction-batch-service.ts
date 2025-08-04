import {
    createAPICollectionService,
    createAPICrudService,
    createAPIExportableService,
} from '@/factory/api-factory-service'

import {
    ITransactionBatch,
    ITransactionBatchDepositInBankRequest,
    ITransactionBatchEndRequest,
    ITransactionBatchMinimal,
    ITransactionBatchRequest,
    ITransactionBatchSignatures,
    TEntityId,
    TTransactionBatchFullorMin,
} from '@/types'

import APIService from './api-service'

const CollectionServices =
    createAPICollectionService<ITransactionBatch>('transaction-batch')

const CrudServices = createAPICrudService<
    ITransactionBatch | ITransactionBatchMinimal,
    ITransactionBatchRequest
>('transaction-batch')

const ExportServices = createAPIExportableService('transaction-batch')

export const currentTransactionBatch = async () => {
    const response = await APIService.get<
        ITransactionBatchMinimal | ITransactionBatch
    >('/v1/transaction-batch/current')
    return response.data
}
export const requestTransactionBatchBlotterView = async (id: TEntityId) => {
    const response = await APIService.put<void, ITransactionBatchMinimal>(
        `/api/v1/transaction-batch/${id}/view-request`
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
    >(`/api/v1/transaction-batch/${id}/deposit-in-bank`, data)
    return response.data
}

export const endCurrentBatch = async (data: ITransactionBatchEndRequest) => {
    const response = await APIService.put<
        ITransactionBatchEndRequest,
        TTransactionBatchFullorMin
    >(`/api/v1/transaction-batch/end`, data)
    return response.data
}

export const getAllTransactionBatchViewRequest = async () => {
    const response = await APIService.get<ITransactionBatch[]>(
        '/api/v1/transaction-batch/view-request'
    )
    return response.data
}

export const allowBlotterView = async (id: TEntityId) => {
    const response = await APIService.put<void, ITransactionBatch>(
        `/api/v1/transaction-batch/${id}/view-accept`
    )
    return response.data
}

export const getAllEndedBatchViewRequest = async () => {
    const response = await APIService.get<ITransactionBatch[]>(
        '/api/v1/transaction-batch/ended-batch'
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
    >(`/api/v1/transaction-batch/${id}/signature`, data)
    return response.data
}

export const { allList, search } = CollectionServices
export const { create, deleteById, deleteMany, getById, updateById } =
    CrudServices
export const { exportAll, exportFiltered, exportSelected } = ExportServices

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
    ...ExportServices,
    ...CollectionServices,
}
