import qs from 'query-string'

import { createAPICollectionService } from '@/factory/api-factory-service'
import { downloadFile } from '@/helpers'
import { IAccount, IAccountRequest } from '@/types/coop-types/accounts/account'

import { TEntityId, UpdateIndexRequest } from '@/types'

import APIService from '../api-service'

const { search } = createAPICollectionService<IAccount>('/api/v1/account')

export const getAccountById = async (id: TEntityId) => {
    const response = await APIService.get<IAccount>(`/api/v1/account/${id}`)
    return response.data
}

export const getAllAccounts = async () => {
    const response = await APIService.get<IAccount[]>(`/api/v1/account`)
    return response.data
}

export const createAccount = async (accountData: IAccountRequest) => {
    const response = await APIService.post<IAccountRequest, IAccount>(
        `/api/v1/account`,
        accountData
    )
    return response.data
}

export const updateAccount = async (
    id: TEntityId,
    accountData: IAccountRequest
) => {
    const response = await APIService.put<IAccountRequest, IAccount>(
        `/api/v1/account/${id}`,
        accountData
    )
    return response.data
}

export const deleteAccount = async (id: TEntityId) => {
    const response = await APIService.delete<void>(`/api/v1/account/${id}`)
    return response.data
}

export const deleteMany = async (ids: TEntityId[]) => {
    const endpoint = `/api/v1/account/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}

export const exportAll = async () => {
    const url = `/api/v1/account/export`
    await downloadFile(url, 'all_banks_export.xlsx')
}

export const exportAllFiltered = async (filters?: string) => {
    const url = `/api/v1/account/export-search?filter=${filters || ''}`
    await downloadFile(url, 'filtered_account_export.xlsx')
}

export const exportSelected = async (ids: TEntityId[]) => {
    const url = qs.stringifyUrl(
        {
            url: `/api/v1/account/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFile(url, 'selected_banks_export.xlsx')
}

export const AccountUpdateIndex = async (
    changedItems: UpdateIndexRequest[]
): Promise<IAccount> => {
    const response = await Promise.all(
        changedItems.map((item) =>
            APIService.put<{ accountId: TEntityId; index: number }, IAccount>(
                `/api/v1/account/${item.id}/index/${item.index}`
            )
        )
    )
    return response[0].data
}

export const deleteGLAccounts = async (
    accountId: TEntityId
): Promise<IAccount> => {
    const response = await APIService.put<{ accountId: TEntityId }, IAccount>(
        `/api/v1/account/${accountId}/general-ledger-definition/remove`
    )
    return response.data
}

export { search }
