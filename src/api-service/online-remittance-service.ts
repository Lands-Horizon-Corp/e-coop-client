import APIService from './api-service'
import { TEntityId, IOnlineRemitance, IOnlineRemitanceRequest } from '@/types'

export const createTransactionBatchOnlineRemittance = async (
    transactionBatchId: TEntityId,
    data: IOnlineRemitance
) => {
    const response = await APIService.post<
        IOnlineRemitanceRequest,
        IOnlineRemitance
    >(`/online-remittance/transaction-batch/${transactionBatchId}`, data)
    return response.data
}
