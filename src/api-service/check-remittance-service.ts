import APIService from './api-service'
import { TEntityId, ICheckRemitance, ICheckRemitanceRequest } from '@/types'

export const createTransactionBatchCheckRemittance = async (
    transactionBatchId: TEntityId,
    data: ICheckRemitanceRequest
) => {
    const response = await APIService.post<
        ICheckRemitanceRequest,
        ICheckRemitance
    >(`/check-remittance/transaction-batch/${transactionBatchId}`, data)
    return response.data
}
