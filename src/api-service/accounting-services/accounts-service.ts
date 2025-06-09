import { TEntityId } from '@/types'
import APIService from '../api-service'
import { IAccount, IAccountRequest } from '@/types/coop-types/accounts/account'

export const getAccountById = async (id: TEntityId) => {
    const response = await APIService.get<IAccount>(`/account/${id}`)
    return response.data
}

export const getAllAccounts = async () => {
    const response = await APIService.get<IAccount[]>(`/account`)
    return response.data
}

export const createAccount = async (accountData: IAccountRequest) => {
    const response = await APIService.post<IAccountRequest, IAccount>(
        `/account`,
        accountData
    )
    return response.data
}

export const updateAccount = async (
    id: TEntityId,
    accountData: IAccountRequest
) => {
    const response = await APIService.put<IAccountRequest, IAccount>(
        `/account/${id}`,
        accountData
    )
    return response.data
}

export const deleteAccount = async (id: TEntityId) => {
    const response = await APIService.delete<void>(`/account/${id}`)
    return response.data
}
