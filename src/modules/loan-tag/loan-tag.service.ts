import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

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

    useGetAll: useGetAllLoanTag,
    useGetById: useGetLoanTagById,
    useGetPaginated: useGetPaginatedLoanTag,

    useDeleteById: useDeleteLoanTagById,
    useDeleteMany: useDeleteManyLoanTag,
} = apiCrudHooks

// custom hooks can go here
