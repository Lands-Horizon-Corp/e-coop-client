import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TEntityId } from '@/types'

import type {
    IAccountHistory,
    IAccountHistoryRequest,
} from '../account-history'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: accountHistoryBaseKey,
} = createDataLayerFactory<IAccountHistory, IAccountHistoryRequest>({
    url: '/api/v1/account-history',
    baseKey: 'account-history',
})

export const {
    API,
    route: accountHistoryAPIRoute,

    create: createAccountHistory,
    updateById: updateAccountHistoryById,

    deleteById: deleteAccountHistoryById,
    deleteMany: deleteManyAccountHistory,

    getById: getAccountHistoryById,
    getAll: getAllAccountHistory,
    getPaginated: getPaginatedAccountHistory,
} = apiCrudService

export { accountHistoryBaseKey }

export const {
    useCreate: useCreateAccountHistory,
    useUpdateById: useUpdateAccountHistoryById,

    useGetAll: useGetAllAccountHistory,
    useGetById: useGetAccountHistoryById,
    useGetPaginated: useGetPaginatedAccountHistory,

    useDeleteById: useDeleteAccountHistoryById,
    useDeleteMany: useDeleteManyAccountHistory,
} = apiCrudHooks

const getAccountHistoryByAccountId = async (accountId: string) => {
    return (
        await API.get<IAccountHistory[]>(
            `${accountHistoryAPIRoute}/account/${accountId}`
        )
    ).data
}

export const useGetAccountHistoryByAccountId = ({
    options,
    query,
    accountId,
}: {
    accountId: TEntityId
    query?: Record<string, unknown>
    options?: HookQueryOptions<IAccountHistory[], Error>
}) => {
    return useQuery<IAccountHistory[], Error>({
        queryKey: ['account-history', accountId, query],
        queryFn: async () => {
            return getAccountHistoryByAccountId(accountId)
        },
        ...options,
    })
}

export const logger = Logger.getInstance('account-history')
