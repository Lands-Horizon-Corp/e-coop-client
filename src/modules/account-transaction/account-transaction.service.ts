import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IAccountTransaction,
    IAccountTransactionGenerateRequest,
    IAccountTransactionLedger,
    IAccountTransactionRequest,
} from '../account-transaction'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: accountTransactionBaseKey,
} = createDataLayerFactory<IAccountTransaction, IAccountTransactionRequest>({
    url: '/api/v1/account-transaction',
    baseKey: 'account-transaction',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: accountTransactionAPIRoute, // matches url above

    create: createAccountTransaction,
    updateById: updateAccountTransactionById,

    deleteById: deleteAccountTransactionById,
    deleteMany: deleteManyAccountTransaction,

    getById: getAccountTransactionById,
    getAll: getAllAccountTransaction,
    getPaginated: getPaginatedAccountTransaction,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { accountTransactionBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateAccountTransaction,
    // useUpdateById: useUpdateAccountTransactionById,

    // useGetAll: useGetAllAccountTransaction,
    useGetById: useGetAccountTransactionById,
    useGetPaginated: useGetPaginatedAccountTransaction,

    useDeleteById: useDeleteAccountTransactionById,
    useDeleteMany: useDeleteManyAccountTransaction,
} = apiCrudHooks

export type AccountTransactionGetAllHookMode = 'all' | 'month-year'

export const useUpdateAccountTransactionById = createMutationFactory<
    IAccountTransaction,
    Error,
    { id: TEntityId; payload: IAccountTransactionRequest }
>({
    mutationFn: (variables) => updateAccountTransactionById(variables),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [accountTransactionBaseKey],
        })
        updateMutationInvalidationFn(accountTransactionBaseKey, args)
    },
})

export const useGetAllAccountTransaction = ({
    mode = 'all',
    query,
    options,
    month,
    year,
}: {
    mode?: AccountTransactionGetAllHookMode
    month?: number
    year?: number
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IAccountTransaction[], Error>
} = {}) => {
    return useQuery<IAccountTransaction[], Error>({
        ...options,
        queryKey: [accountTransactionBaseKey, mode, year, month, query].filter(
            Boolean
        ),
        queryFn: async () => {
            let url = `${accountTransactionAPIRoute}`

            if (mode === 'month-year')
                url = `${accountTransactionAPIRoute}/year/${year}/month/${month}`

            return await getAllAccountTransaction({
                url,
                query,
            })
        },
    })
}

export const useGenerateAccountTransaction = createMutationFactory<
    void,
    Error,
    IAccountTransactionGenerateRequest
>({
    mutationFn: async (payload) => {
        await API.post(`${accountTransactionAPIRoute}/process-gl`, payload)
    },
    defaultInvalidates: [
        [accountTransactionBaseKey, 'all'],
        [accountTransactionBaseKey, 'month-year'],
    ],
})

export const useGetAccountTransactionLedgers = ({
    year,
    options,
    accountId,
}: {
    accountId: TEntityId
    year: number
    options?: HookQueryOptions<IAccountTransactionLedger[], Error>
}) => {
    return useQuery<IAccountTransactionLedger[], Error>({
        ...options,
        queryKey: [
            accountTransactionBaseKey,
            'account-transaction-ledger',
            accountId,
            year,
        ],
        queryFn: async () => {
            const response = await API.get<IAccountTransactionLedger[]>(
                `${accountTransactionAPIRoute}/account/${accountId}/year/${year}`
            )
            return response.data
        },
    })
}

export const logger = Logger.getInstance('account-transaction')
// custom hooks can go here
