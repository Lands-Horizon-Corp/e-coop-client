import { useQuery } from '@tanstack/react-query'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IAutomaticLoanDeduction,
    IAutomaticLoanDeductionRequest,
} from '../automatic-loan-deduction'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: automaticLoanDeductionBaseKey,
} = createDataLayerFactory<
    IAutomaticLoanDeduction,
    IAutomaticLoanDeductionRequest
>({
    url: '/api/v1/automatic-loan-deduction',
    baseKey: 'automatic-loan-deduction',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: automaticLoanDeductionAPIRoute, // matches url above

    create: createAutomaticLoanDeduction,
    updateById: updateAutomaticLoanDeductionById,

    deleteById: deleteAutomaticLoanDeductionById,
    deleteMany: deleteManyAutomaticLoanDeduction,

    getById: getAutomaticLoanDeductionById,
    getAll: getAllAutomaticLoanDeduction,
    getPaginated: getPaginatedAutomaticLoanDeduction,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { automaticLoanDeductionBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateAutomaticLoanDeduction,
    useUpdateById: useUpdateAutomaticLoanDeductionById,

    useGetAll: useGetAllAutomaticLoanDeduction,
    useGetById: useGetAutomaticLoanDeductionById,
    useGetPaginated: useGetPaginatedAutomaticLoanDeduction,

    useDeleteById: useDeleteAutomaticLoanDeductionById,
    useDeleteMany: useDeleteManyAutomaticLoanDeduction,
} = apiCrudHooks

// custom hooks can go here

export const useGetAllAutomaticLoanDeductionsByComputationSheetSchemeId = ({
    query,
    options,
    computationSheetId,
}: {
    computationSheetId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IAutomaticLoanDeduction[], Error>
}) => {
    return useQuery<IAutomaticLoanDeduction[], Error>({
        ...options,
        queryKey: [
            automaticLoanDeductionBaseKey,
            'all',
            'scheme',
            computationSheetId,
            query,
        ],
        queryFn: async () =>
            getAllAutomaticLoanDeduction({
                query,
                url: `${automaticLoanDeductionAPIRoute}/computation-sheet/${computationSheetId}`,
            }),
    })
}
