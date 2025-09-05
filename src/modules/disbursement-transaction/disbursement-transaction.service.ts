import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IDisbursementTransaction,
    IDisbursementTransactionPaginated,
    IDisbursementTransactionRequest,
} from './disbursement-transaction.types'

const { apiCrudHooks, apiCrudService, baseQueryKey } = createDataLayerFactory<
    IDisbursementTransaction,
    IDisbursementTransactionRequest
>({
    url: '/api/v1/disbursement-transaction',
    baseKey: 'disbursement-transaction',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API: disbursementTransactionAPI,
    route: disbursementTransactionAPIRoute,

    create: createDisbursementTransaction,
    updateById: updateDisbursementTransactionId,

    deleteById: deleteDisbursementTransactionById,
    deleteMany: deleteManyDisbursementTransaction,

    getById: getDisbursementTransactionById,
    getAll: getAllDisbursmentTransaction,
    getPaginated: getPaginatedDisbursementTransaction,
} = apiCrudService

// write ur custom api service here and export it
// ex: export const getSomethingByOrgId = async () => disbursementTransactionAPI.get({....})

// 🪝 HOOK STARTS HERE
export { baseQueryKey } // might needed outside

export const {
    useCreate: useCreateDisbursementTransaction,

    useDeleteById: useDeleteDisbursementTransactionById,
    useDeleteMany: useDeleteManyDisbursementTransaction,

    useGetById: useGetDisbursementTransactionById,
    useGetPaginated: useGetPaginatedDisbursementTransaction,
} = apiCrudHooks

// write ur custom hook here and export it

// 🪝 get paginated transaction
export type TDisbursementTransactionHookMode =
    | 'branch'
    | 'current'
    | 'employee'
    | 'transaction-batch'

export const useFilteredPaginatedDisbursementTransaction = ({
    mode = 'branch',
    userOrganizationId,
    transactionBatchId,
    query,
    options,
}: {
    mode?: TDisbursementTransactionHookMode
    userOrganizationId?: TEntityId
    transactionBatchId?: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IDisbursementTransactionPaginated, Error>
}) => {
    return useQuery<IDisbursementTransactionPaginated, Error>({
        ...options,
        queryKey: [
            'disbursement-transaction',
            'filtered-paginated',
            mode,
            userOrganizationId,
            transactionBatchId,
            query,
        ].filter(Boolean),
        queryFn: async () => {
            let url: string = `${apiCrudService.route}/branch/search`

            switch (mode) {
                case 'branch':
                    url = `${apiCrudService.route}/branch/search`
                    break

                case 'current':
                    url = `${apiCrudService.route}/current/search`
                    break

                case 'employee':
                    if (!userOrganizationId) {
                        throw new Error(
                            'userOrganizationId is required for employee mode'
                        )
                    }
                    url = `${apiCrudService.route}/employee/${userOrganizationId}/search`
                    break

                case 'transaction-batch':
                    if (!transactionBatchId) {
                        throw new Error(
                            'transactionBatchId is required for transaction-batch mode'
                        )
                    }
                    url = `${apiCrudService.route}/transaction-batch/${transactionBatchId}/search`
                    break

                default:
                    throw new Error(`Unsupported mode: ${mode}`)
            }

            const finalUrl = qs.stringifyUrl(
                {
                    url,
                    query,
                },
                { skipNull: true }
            )

            return await apiCrudService.getPaginated<IDisbursementTransaction>({
                url: finalUrl,
                query,
            })
        },
    })
}
