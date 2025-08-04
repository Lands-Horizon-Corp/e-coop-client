import { IOnlineRemitance, IOnlineRemitanceRequest, TEntityId } from '@/types'

import APIService from './api-service'

export const createTransactionBatchOnlineRemittance = async (
    data: IOnlineRemitanceRequest
) => {
    const response = await APIService.post<
        IOnlineRemitanceRequest,
        IOnlineRemitance
    >(`/api/v1/online-remittance`, data)
    return response.data
}

export const currentTransactionBatchOnlineRemittances = async () => {
    const response = await APIService.get<IOnlineRemitance[]>(
        `/api/v1/online-remittance`
    )
    return response.data
}

export const updateTransactionBatchOnlineRemittance = async (
    id: TEntityId,
    data: IOnlineRemitanceRequest
) => {
    const response = await APIService.put<
        IOnlineRemitanceRequest,
        IOnlineRemitance
    >(`/api/v1/online-remittance/${id}`, data)
    return response.data
}

export const deleteTransactionBatchOnlineRemittance = async (id: TEntityId) => {
    await APIService.delete(`/api/v1/online-remittance/${id}`)
}
