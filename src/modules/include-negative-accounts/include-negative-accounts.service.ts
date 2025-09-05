import { useQuery } from '@tanstack/react-query'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    createMutationInvalidateFn,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IIncludeNegativeAccounts,
    IIncludeNegativeAccountsRequest,
} from '../include-negative-accounts'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: includeNegativeAccountsBaseKey,
} = createDataLayerFactory<
    IIncludeNegativeAccounts,
    IIncludeNegativeAccountsRequest
>({
    url: '/api/v1/include-negative-accounts',
    baseKey: 'include-negative-accounts',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: includeNegativeAccountsAPIRoute, // matches url above

    create: createIncludeNegativeAccounts,
    updateById: updateIncludeNegativeAccountsById,

    deleteById: deleteIncludeNegativeAccountsById,
    deleteMany: deleteManyIncludeNegativeAccounts,

    getById: getIncludeNegativeAccountsById,
    getAll: getAllIncludeNegativeAccounts,
    getPaginated: getPaginatedIncludeNegativeAccounts,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { includeNegativeAccountsBaseKey } // Exported in case it's needed outside

export const {
    // useCreate: useCreateIncludeNegativeAccounts,
    // useUpdateById: useUpdateIncludeNegativeAccountsById,

    // useGetAll: useGetAllIncludeNegativeAccounts,
    useGetById: useGetIncludeNegativeAccountsById,
    useGetPaginated: useGetPaginatedIncludeNegativeAccounts,

    useDeleteById: useDeleteIncludeNegativeAccountsById,
    useDeleteMany: useDeleteManyIncludeNegativeAccounts,
} = apiCrudHooks

// custom hooks can go here

export const useCreateIncludeNegativeAccounts = createMutationFactory<
    IIncludeNegativeAccounts,
    Error,
    IIncludeNegativeAccountsRequest
>({
    mutationFn: (payload) => createIncludeNegativeAccounts({ payload }),
    invalidationFn: (args) => {
        createMutationInvalidateFn(includeNegativeAccountsBaseKey, args)
        args.queryClient.invalidateQueries({
            queryKey: [
                includeNegativeAccountsBaseKey,
                'all',
                'scheme',
                args.variables.computation_sheet_id,
            ],
        })
    },
})

export const useUpdateIncludeNegativeAccountsById = createMutationFactory<
    IIncludeNegativeAccounts,
    Error,
    { id: TEntityId; payload: IIncludeNegativeAccountsRequest }
>({
    mutationFn: (variables) => updateIncludeNegativeAccountsById(variables),
    invalidationFn: (args) => {
        updateMutationInvalidationFn(includeNegativeAccountsBaseKey, args)
        args.queryClient.invalidateQueries({
            queryKey: [
                includeNegativeAccountsBaseKey,
                'all',
                'scheme',
                args.variables.payload.computation_sheet_id,
            ],
        })
    },
})

export const useGetAllIncludeNegativeAccounts = ({
    computationSheetId,
    query,
    options,
}: {
    computationSheetId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IIncludeNegativeAccounts[], Error>
}) => {
    return useQuery<IIncludeNegativeAccounts[], Error>({
        ...options,
        queryKey: [
            includeNegativeAccountsBaseKey,
            'all',
            'scheme',
            computationSheetId,
            query,
        ],
        queryFn: async () =>
            getAllIncludeNegativeAccounts({
                url: `${includeNegativeAccountsAPIRoute}/computation-sheet/${computationSheetId}`,
                query,
            }),
    })
}
