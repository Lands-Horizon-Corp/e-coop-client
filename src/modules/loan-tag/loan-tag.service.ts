import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type { ILoanTag, ILoanTagRequest } from '../loan-tag'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: loanTagBaseKey,
} = createDataLayerFactory<ILoanTag, ILoanTagRequest>({
    url: '/api/v1/loan-tag',
    baseKey: 'loan-tag',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: loanTagAPIRoute, // matches url above

    create: createLoanTag,
    updateById: updateLoanTagById,

    deleteById: deleteLoanTagById,
    deleteMany: deleteManyLoanTag,

    getById: getLoanTagById,
    getAll: getAllLoanTag,
    getPaginated: getPaginatedLoanTag,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { loanTagBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateLoanTag,
    useUpdateById: useUpdateLoanTagById,

    // useGetAll: useGetAllLoanTag,
    useGetById: useGetLoanTagById,
    useGetPaginated: useGetPaginatedLoanTag,

    useDeleteById: useDeleteLoanTagById,
    useDeleteMany: useDeleteManyLoanTag,
} = apiCrudHooks

// custom hooks can go here
export type TGellAllLoanTagHookMode = 'all' | 'loan-transaction'

export const useGetAllLoanTag = ({
    mode = 'all',
    loanTransactionId,
    query,
    options,
}: {
    mode: TGellAllLoanTagHookMode
    loanTransactionId?: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<ILoanTag[], Error>
}) => {
    return useQuery<ILoanTag[], Error>({
        ...options,
        queryKey: [
            loanTagBaseKey,
            'all',
            query,
            mode,
            loanTransactionId,
        ].filter(Boolean),
        queryFn: async () => {
            let url = loanTagAPIRoute

            if (mode === 'loan-transaction')
                url = `${loanTagAPIRoute}/loan-transaction/${loanTransactionId}`

            return await getAllLoanTag({
                query,
                url,
            })
        },
    })
}

export const logger = Logger.getInstance('loan-tag')
