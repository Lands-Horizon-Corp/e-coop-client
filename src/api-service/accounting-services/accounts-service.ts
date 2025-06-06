import { TPagination } from '@/hooks/use-pagination'
import { TEntityId } from '@/types'
import qs from 'query-string'
import APIService from '../api-service'
import { downloadFileService } from '@/helpers'
import { IAccount, IAccountRequest } from '@/types/coop-types/accounts/account'

const buildAccountUrl = (
    endpoint: string,
    {
        filters,
        preloads,
        pagination,
        sort,
        ids, // Added for export selected
    }: {
        filters?: string
        preloads?: string[]
        pagination?: TPagination
        sort?: string
        ids?: TEntityId[]
    }
): string => {
    return qs.stringifyUrl(
        {
            url: `/account${endpoint}`,
            query: {
                sort,
                preloads,
                filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
                ids,
            },
        },
        { skipNull: true, skipEmptyString: true }
    )
}

// GET /account/:id
export const getAccountById = async (id: TEntityId): Promise<IAccount> => {
    const response = await APIService.get<IAccount>(`/account/${id}`)
    return response.data
}

// GET /account/
export const getAllAccounts = async (): Promise<IAccount[]> => {
    const response = await APIService.get<IAccount[]>(`/account`)
    return response.data
}

// POST /account
export const createAccount = async (
    accountData: IAccountRequest // Corrected from IAccountsRequest
): Promise<IAccount> => {
    const response = await APIService.post<IAccountRequest, IAccount>(
        `/account`,
        accountData
    )
    return response.data
}

// PUT /account/:id
export const updateAccount = async (
    id: TEntityId,
    accountData: IAccountRequest // Corrected from IAccountsRequest
): Promise<IAccount> => {
    const response = await APIService.put<IAccountRequest, IAccount>(
        `/account/${id}`,
        accountData
    )
    return response.data
}

// DELETE /account/:id
export const deleteAccount = async (id: TEntityId): Promise<void> => {
    const response = await APIService.delete<void>(`/account/${id}`)
    return response.data // APIService.delete might return response.data for void, or you might just not return anything.
}

// DELETE /account/bulk-delete
export const deleteManyAccounts = async (ids: TEntityId[]): Promise<void> => {
    const endpoint = `/account/bulk-delete`
    await APIService.delete<void>(endpoint, { ids }) // Assuming APIService.delete can take a payload for body
}

// GET /account/export
export const exportAllAccounts = async (): Promise<void> => {
    const url = buildAccountUrl(`/export`, {})
    await downloadFileService(url, 'all_accounts_export.xlsx')
}

// GET /account/export-search?filter=...
export const exportAllFilteredAccounts = async (
    filters?: string
): Promise<void> => {
    const url = buildAccountUrl(`/export-search`, { filters }) // filters directly in query string
    await downloadFileService(url, 'filtered_accounts_export.xlsx')
}

// GET /account/export-selected?ids=...
export const exportSelectedAccounts = async (
    ids: TEntityId[]
): Promise<void> => {
    const url = buildAccountUrl(`/export-selected`, { ids })
    await downloadFileService(url, 'selected_accounts_export.xlsx')
}

// GET /account/export-current-page/:page
export const exportCurrentPageAccounts = async (
    page: number
): Promise<void> => {
    const url = `/account/export-current-page/${page}` // Direct path for this one
    await downloadFileService(url, `current_page_accounts_${page}_export.xlsx`)
}
