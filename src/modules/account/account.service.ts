import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import { downloadFile } from '@/helpers/common-helper'
import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TEntityId, UpdateIndexRequest } from '@/types'

import {
    IAccount,
    IAccountPaginated,
    IAccountRequest,
    TDeleteAccountFromGLFSType,
    TPaginatedAccountHookMode,
} from './account.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IAccount,
    IAccountRequest
>({
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

export const deleteAccountFromGLFS = async ({
    id,
    mode,
}: TDeleteAccountFromGLFSType) => {
    const type = `${mode}-definition`
    return (await API.put<IAccount, IAccount>(`${route}/${id}/${type}/remove`))
        .data
}

export const useUpdateAccountIndex = createMutationFactory<
    IAccount,
    Error,
    UpdateIndexRequest[]
>({
    mutationFn: AccountUpdateIndex,
    invalidationFn: (args) =>
        updateMutationInvalidationFn('update-account-index', args),
})

export const useDeleteAccountFromGLFS = createMutationFactory<
    IAccount,
    Error,
    TDeleteAccountFromGLFSType
>({
    mutationFn: deleteAccountFromGLFS,
    invalidationFn: (args) =>
        updateMutationInvalidationFn('delete-gl-account', args),
})

export const useFilteredPaginatedAccount = ({
    mode,
    options,
    query,
}: {
    mode?: TPaginatedAccountHookMode
    query?: Record<string, unknown>
    options?: HookQueryOptions<IAccountPaginated, Error>
}) => {
    return useQuery<IAccountPaginated, Error>({
        queryKey: ['account', 'paginated', mode, query],
        queryFn: async () => {
            const targetUrl = mode ? `${mode}/search` : 'search'

            return apiCrudService.getPaginated<IAccount>({
                url: `${apiCrudService.route}/${targetUrl}`,
                query,
            })
        },
        ...options,
    })
}
