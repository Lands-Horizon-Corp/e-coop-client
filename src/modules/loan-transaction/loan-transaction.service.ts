import { useQuery } from '@tanstack/react-query'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    ILoanTransaction,
    ILoanTransactionPaginated,
    ILoanTransactionRequest,
} from '../loan-transaction'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: loanTransactionBaseKey,
} = createDataLayerFactory<ILoanTransaction, ILoanTransactionRequest>({
    url: '/api/v1/loan-transaction',
    baseKey: 'loan-transaction',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: loanTransactionAPIRoute, // matches url above

    create: createLoanTransaction,
    updateById: updateLoanTransactionById,

    deleteById: deleteLoanTransactionById,
    deleteMany: deleteManyLoanTransaction,

    getById: getLoanTransactionById,
    getAll: getAllLoanTransaction,
    getPaginated: getPaginatedLoanTransaction,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { loanTransactionBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateLoanTransaction,
    useUpdateById: useUpdateLoanTransactionById,

    useGetAll: useGetAllLoanTransaction,
    useGetById: useGetLoanTransactionById,
    // useGetPaginated: useGetPaginatedLoanTransaction,

    useDeleteById: useDeleteLoanTransactionById,
    useDeleteMany: useDeleteManyLoanTransaction,
} = apiCrudHooks

// custom hooks can go here

export type TLoanTransactionHookMode = 'branch' | 'member-profile'

export const useGetPaginatedLoanTransaction = ({
    mode = 'branch',

    memberProfileId,

    query,
    options,
}: {
    mode: TLoanTransactionHookMode
    memberProfileId?: TEntityId

    query?: TAPIQueryOptions
    options?: HookQueryOptions<ILoanTransactionPaginated, Error>
}) => {
    return useQuery<ILoanTransactionPaginated, Error>({
        ...options,
        queryKey: [
            loanTransactionBaseKey,
            'paginated',
            mode,
            memberProfileId,
            query,
        ].filter(Boolean),
        queryFn: async () => {
            let url = `${loanTransactionAPIRoute}/search`

            if (mode === 'member-profile') {
                url = `${loanTransactionAPIRoute}/member-profile/${memberProfileId}/search`
            }

            return getPaginatedLoanTransaction({ url, query })
        },
    })
}
