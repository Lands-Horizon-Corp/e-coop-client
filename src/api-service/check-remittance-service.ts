import { ICheckRemittance, ICheckRemittanceRequest, TEntityId } from '@/types'

import APIService from './api-service'

export const createTransactionBatchCheckRemittance = async (
    data: ICheckRemittanceRequest
) => {
    const response = await APIService.post<
        ICheckRemittanceRequest,
        ICheckRemittance
    >(`/check-remittance`, data)
    return response.data
}

export const updateTransactionBatchCheckRemittance = async (
    id: TEntityId,
    data: ICheckRemittanceRequest
) => {
    const response = await APIService.put<
        ICheckRemittanceRequest,
        ICheckRemittance
    >(`/check-remittance/${id}`, data)
    return response.data
}

export const currentTransactionBatchCheckRemittances = async () => {
    const response =
        await APIService.get<ICheckRemittance[]>(`/check-remittance`)
    return response.data
}

export const deleteTransactionBatchCheckRemittance = async (id: TEntityId) => {
    await APIService.delete(`/check-remittance/${id}`)
}
