import { useQuery } from '@tanstack/react-query'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    ILoanClearanceAnalysis,
    ILoanClearanceAnalysisRequest,
} from '../loan-clearance-analysis'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: loanClearanceAnalysisBaseKey,
} = createDataLayerFactory<
    ILoanClearanceAnalysis,
    ILoanClearanceAnalysisRequest
>({
    url: '/api/v1/loan-clearance-analysis',
    baseKey: 'loan-clearance-analysis',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: loanClearanceAnalysisAPIRoute, // matches url above

    create: createLoanClearanceAnalysis,
    updateById: updateLoanClearanceAnalysisById,

    deleteById: deleteLoanClearanceAnalysisById,
    deleteMany: deleteManyLoanClearanceAnalysis,

    getById: getLoanClearanceAnalysisById,
    getAll: getAllLoanClearanceAnalysis,
    getPaginated: getPaginatedLoanClearanceAnalysis,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { loanClearanceAnalysisBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateLoanClearanceAnalysis,
    useUpdateById: useUpdateLoanClearanceAnalysisById,

    // useGetAll: useGetAllLoanClearanceAnalysis,
    useGetById: useGetLoanClearanceAnalysisById,
    useGetPaginated: useGetPaginatedLoanClearanceAnalysis,

    useDeleteById: useDeleteLoanClearanceAnalysisById,
    useDeleteMany: useDeleteManyLoanClearanceAnalysis,
} = apiCrudHooks

// custom hooks can go here
export const useGetAllLoanClearanceAnalysis = ({
    loanTransactionId,
    query,
    options,
}: {
    loanTransactionId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<ILoanClearanceAnalysis[], Error>
}) => {
    return useQuery<ILoanClearanceAnalysis[], Error>({
        ...options,
        queryKey: [
            loanClearanceAnalysisBaseKey,
            'all',
            query,
            'loan-transaction',
            loanTransactionId,
        ].filter(Boolean),
        queryFn: async () =>
            getAllLoanClearanceAnalysis({
                query,
                url: `${loanClearanceAnalysisAPIRoute}/loan-transaction/${loanTransactionId}`,
            }),
    })
}
