import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import { downloadFile } from '@/helpers/common-helper'
import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId, UpdateIndexRequest } from '@/types'

import {
    IAccount,
    IAccountPaginated,
    IAccountRequest,
    TAccountComputationsheetConnect,
    TAccountLoanConnect,
    TDeleteAccountFromGLFSType,
    TGetAllAccountMode,
    TPaginatedAccountHookMode,
} from './account.types'

const { baseQueryKey, apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IAccount,
    IAccountRequest
>({
    url: '/api/v1/account',
    baseKey: 'account',
})

export const accountBaseQueryKey = baseQueryKey

export const { getAll: getAllAccounts } = apiCrudService

export const { API, route: accountAPIRoute } = apiCrudService

export const {
    useCreate,
    // useGetAll,
    useGetById: useGetAccountById,
    useDeleteById,
    useUpdateById,
    useGetPaginated,
} = apiCrudHooks

export const deleteMany = async (ids: TEntityId[]) => {
    const endpoint = `${accountAPIRoute}/bulk-delete`
    await API.delete<void>(endpoint, { ids })
}

export const exportAll = async () => {
    const url = `${accountAPIRoute}/export`
    await downloadFile(url, 'all_banks_export.xlsx')
}

export const exportAllFiltered = async (filters?: string) => {
    const url = `${accountAPIRoute}/export-search?filter=${filters || ''}`
    await downloadFile(url, 'filtered_account_export.xlsx')
}

export const exportSelected = async (ids: TEntityId[]) => {
    const url = qs.stringifyUrl(
        {
            url: `${accountAPIRoute}/export-selected`,
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
                `${accountAPIRoute}/${item.id}/index/${item.index}`
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
    return (
        await API.put<IAccount, IAccount>(
            `${accountAPIRoute}/${id}/${type}/remove`
        )
    ).data
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
    currencyId,
}: {
    mode?: TPaginatedAccountHookMode
    query?: Record<string, unknown>
    options?: HookQueryOptions<IAccountPaginated, Error>
    currencyId?: TEntityId
}) => {
    return useQuery<IAccountPaginated, Error>({
        queryKey: [
            accountBaseQueryKey,
            'paginated',
            mode,
            currencyId,
            query,
        ].filter(Boolean),
        queryFn: async () => {
            let targetUrl = ''
            if (mode === 'all') targetUrl = 'search'
            else if (mode === 'currency') {
                targetUrl = currencyId
                    ? `currency/${currencyId}/search`
                    : 'search'
            } else if (mode === 'currency-payment') {
                targetUrl = currencyId
                    ? `currency/${currencyId}/payment/search`
                    : 'search'
            } else if (mode === 'currency-cash-and-cash-equivalence') {
                targetUrl = currencyId
                    ? `currency/${currencyId}/cash-and-cash-equivalence/search`
                    : 'search'
            } else if (mode === 'currency-paid-up-shared-capital') {
                targetUrl = currencyId
                    ? `currency/${currencyId}/paid-up-shared-capital/search`
                    : 'search'
            } else if (mode === 'currency-loan') {
                targetUrl = currencyId
                    ? `currency/${currencyId}/loan/search`
                    : 'search'
            } else if (mode === 'loan-connectable-account-currency') {
                targetUrl = `loan-connectable-account-currency/${currencyId}/search`
            } else {
                targetUrl = mode ? `${mode}/search` : 'search'
            }

            return apiCrudService.getPaginated<IAccount>({
                url: `${apiCrudService.route}/${targetUrl}`,
                query,
            })
        },
        ...options,
    })
}

export const useAccountsComputation = ({
    options,
    query,
    computationSheetId,
}: {
    computationSheetId: TEntityId
    query?: Record<string, unknown>
    options?: HookQueryOptions<IAccount[], Error>
}) => {
    return useQuery<IAccount[], Error>({
        queryKey: [
            accountBaseQueryKey,
            'computation-sheet',
            computationSheetId,
            query,
        ],
        queryFn: async () => {
            return apiCrudService.getAll<IAccount>({
                url: `${apiCrudService.route}/computation-sheet/${computationSheetId}`,
                query,
            })
        },
        ...options,
    })
}

export const useAccountComputationConnect = createMutationFactory<
    IAccount,
    Error,
    TAccountComputationsheetConnect
>({
    mutationFn: async ({ computation_sheet_id, account_id }) => {
        return (
            await API.put<TAccountComputationsheetConnect, IAccount>(
                `${apiCrudService.route}/${account_id}/computation-sheet/${computation_sheet_id}/connect`,
                { computation_sheet_id, account_id }
            )
        ).data
    },
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [
                'computation-sheet',
                args.variables.computation_sheet_id,
            ],
        })
        args.queryClient.invalidateQueries({
            queryKey: [
                accountBaseQueryKey,
                'computation-sheet',
                args.variables.computation_sheet_id,
            ],
        })
    },
})

export const useAccountComputationDisconnect = createMutationFactory<
    IAccount,
    Error,
    TAccountComputationsheetConnect
>({
    mutationFn: async ({ computation_sheet_id, account_id }) => {
        return (
            await API.put<TAccountComputationsheetConnect, IAccount>(
                `${apiCrudService.route}/${account_id}/computation-sheet/disconnect`,
                { computation_sheet_id, account_id }
            )
        ).data
    },
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [
                'computation-sheet',
                args.variables.computation_sheet_id,
            ],
        })
        args.queryClient.invalidateQueries({
            queryKey: [
                accountBaseQueryKey,
                'computation-sheet',
                args.variables.computation_sheet_id,
            ],
        })
    },
})

export const useAccountLoanConnect = createMutationFactory<
    IAccount,
    Error,
    TAccountLoanConnect
>({
    mutationFn: async ({ loan_account_id, account_id }) => {
        return (
            await API.post<TAccountLoanConnect, IAccount>(
                `${apiCrudService.route}/${account_id}/connect-to-loan/${loan_account_id}`,
                { loan_account_id, account_id }
            )
        ).data
    },
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['account', args.variables.account_id],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['account', args.variables.loan_account_id],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['account'],
        })
    },
})

export const getAllAccount = async ({
    mode,
    accountId,
    query,
}: {
    mode?: TGetAllAccountMode
    query?: TAPIQueryOptions
    accountId?: TEntityId
}) => {
    let targetUrl = accountAPIRoute

    if (mode === 'loan-account-connections') {
        targetUrl = `${accountAPIRoute}/${accountId}/loan-accounts`
    }

    return apiCrudService.getAll<IAccount>({
        url: targetUrl,
        query,
    })
}

// GET ALL ACCOUNT with diff mode
export const useGetAllAccount = ({
    mode = 'all',
    query,
    options,
    accountId,
}: {
    mode?: TGetAllAccountMode
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IAccount[], Error>
    accountId?: TEntityId
} = {}) => {
    return useQuery<IAccount[], Error>({
        ...options,
        queryKey: [accountBaseQueryKey, 'all', mode, accountId, query].filter(
            Boolean
        ),
        queryFn: async () =>
            getAllAccount({
                accountId,
                mode,
                query,
            }),
    })
}

export const useConnectAccount = createMutationFactory<
    IAccount[],
    Error,
    { mainAccountId: TEntityId; accountId: TEntityId }
>({
    mutationFn: async ({ accountId, mainAccountId }) => {
        const response = await API.post<void, IAccount[]>(
            `${accountAPIRoute}/${mainAccountId}/connect-to-loan/${accountId}`
        )
        return response.data
    },
    invalidationFn: ({ queryClient, variables }) => {
        queryClient.invalidateQueries({
            queryKey: [
                accountBaseQueryKey,
                'all',
                'loan-account-connections',
                variables.mainAccountId,
            ],
        })
    },
})

export const useDisconnectAccount = createMutationFactory<
    IAccount[],
    Error,
    { accountId: TEntityId }
>({
    mutationFn: async ({ accountId }) => {
        const response = await API.post<void, IAccount[]>(
            `${accountAPIRoute}/${accountId}/disconnect-account`
        )
        return response.data
    },
    defaultInvalidates: [
        [accountBaseQueryKey, 'all', 'loan-account-connections'],
    ],
})

export const logger = Logger.getInstance('account')
