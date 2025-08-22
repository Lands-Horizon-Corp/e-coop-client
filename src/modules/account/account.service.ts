import { MutationOptions, useMutation } from '@tanstack/react-query'
import qs from 'query-string'

import { downloadFile } from '@/helpers/common-helper'
import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import { TEntityId, UpdateIndexRequest } from '@/types'

import { IAccount, IAccountRequest } from './account.types'

const { apiCrudHooks } = createDataLayerFactory<IAccount, IAccountRequest>({
    url: '/api/v1/account',
    baseKey: 'account',
})

export const {
    useCreate,
    useGetAll,
    useGetById,
    useDeleteById,
    useUpdateById,
    useGetPaginated,
} = apiCrudHooks

const { API, route } = createAPIRepository<IAccount, IAccountRequest>(
    '/api/v1/account'
)
export const deleteMany = async (ids: TEntityId[]) => {
    const endpoint = `${route}/bulk-delete`
    await API.delete<void>(endpoint, { ids })
}

export const exportAll = async () => {
    const url = `${route}/export`
    await downloadFile(url, 'all_banks_export.xlsx')
}

export const exportAllFiltered = async (filters?: string) => {
    const url = `${route}/export-search?filter=${filters || ''}`
    await downloadFile(url, 'filtered_account_export.xlsx')
}

export const exportSelected = async (ids: TEntityId[]) => {
    const url = qs.stringifyUrl(
        {
            url: `${route}/export-selected`,
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
            API.put<{ accountId: TEntityId; index: number }, IAccount>(
                `${route}/${item.id}/index/${item.index}`
            )
        )
    )
    return response[0].data
}

export const deleteGLAccount = async (accountId: TEntityId) => {
    return (
        await API.delete<IAccount>(
            `${route}/${accountId}/general-ledger-definition/remove`
        )
    ).data
}

export const useUpdateAccountIndex = (
    options: MutationOptions<IAccount, Error, UpdateIndexRequest[]> = {}
) => {
    return useMutation<IAccount, Error, UpdateIndexRequest[]>({
        mutationFn: AccountUpdateIndex,
        mutationKey: ['update-account-index'],
        ...options,
    })
}

export const useDeleteGLAccount = (
    options: MutationOptions<IAccount, Error, TEntityId> = {}
) => {
    return useMutation<IAccount, Error, TEntityId>({
        mutationFn: deleteGLAccount,
        mutationKey: ['delete-gl-account'],
        ...options,
    })
}
