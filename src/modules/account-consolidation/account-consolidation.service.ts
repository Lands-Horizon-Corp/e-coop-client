import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'
import { TEntityId } from '@/types/common'

import type {
    IAccountConsolidation,
    IAccountConsolidationRequest,
} from '../account-consolidation'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: accountConsolidationBaseKey,
} = createDataLayerFactory<IAccountConsolidation, IAccountConsolidationRequest>(
    {
        url: '/api/v1/account-consolidation',
        baseKey: 'account-consolidation',
    }
)

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: accountConsolidationAPIRoute, // matches url above

    create: createAccountConsolidation,
    updateById: updateAccountConsolidationById,

    deleteById: deleteAccountConsolidationById,
    deleteMany: deleteManyAccountConsolidation,

    getById: getAccountConsolidationById,
    getAll: getAllAccountConsolidation,
    getPaginated: getPaginatedAccountConsolidation,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { accountConsolidationBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateAccountConsolidation,
    useUpdateById: useUpdateAccountConsolidationById,

    useGetAll: useGetAllAccountConsolidation,
    useGetById: useGetAccountConsolidationById,
    useGetPaginated: useGetPaginatedAccountConsolidation,

    useDeleteById: useDeleteAccountConsolidationById,
    useDeleteMany: useDeleteManyAccountConsolidation,
} = apiCrudHooks

type TLinkAccountsPayload = {
    primary_account_id: TEntityId
    linked_account_id: TEntityId
}

export const useGetAllAccountConsolidationByAccountId = (
    accountId: TEntityId,
    options: HookQueryOptions<IAccountConsolidation[], Error> = {}
) =>
    useQuery<IAccountConsolidation[], Error>({
        queryKey: [accountConsolidationBaseKey, 'all', accountId],
        queryFn: async () => {
            const response = await API.get<IAccountConsolidation[]>(
                `${accountConsolidationAPIRoute}/account/${accountId}`
            )
            return response.data
        },
        enabled: !!accountId,
        ...options,
    })

export const useAccountConsolidationLinkAccount = createMutationFactory<
    IAccountConsolidation,
    Error,
    TLinkAccountsPayload
>({
    mutationFn: async ({ primary_account_id, linked_account_id }) => {
        return (
            await API.post<TLinkAccountsPayload, IAccountConsolidation>(
                `${accountConsolidationAPIRoute}/link`,
                {
                    primary_account_id,
                    linked_account_id,
                }
            )
        ).data
    },
    invalidationFn: ({ queryClient }) => {
        queryClient.invalidateQueries({
            queryKey: [accountConsolidationBaseKey, 'all'],
        })
    },
})

export const logger = Logger.getInstance('account-consolidation')
// custom hooks can go here
