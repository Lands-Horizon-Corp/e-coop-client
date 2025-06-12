import APIService from './api-service'
import { TEntityId, IOnlineRemitance, IOnlineRemitanceRequest } from '@/types'

export const createTransactionBatchOnlineRemittance = async (
    data: IOnlineRemitanceRequest
) => {
    const response = await APIService.post<
        IOnlineRemitanceRequest,
        IOnlineRemitance
    >(`/online-remittance`, data)
    return response.data
}

export const currentTransactionBatchOnlineRemittances = async () => {
    const response =
        await APIService.get<IOnlineRemitance[]>(`/online-remittance`)
    return response.data
}

export const updateTransactionBatchOnlineRemittance = async (
    id: TEntityId,
    data: IOnlineRemitanceRequest
) => {
    const response = await APIService.put<
        IOnlineRemitanceRequest,
        IOnlineRemitance
    >(`/online-remittance/${id}`, data)
    return response.data
}

export const deleteTransactionBatchOnlineRemittance = async (id: TEntityId) => {
    await APIService.delete(`/online-remittance/${id}`)
}
