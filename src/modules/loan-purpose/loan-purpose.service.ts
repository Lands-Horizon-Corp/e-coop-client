import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { ILoanPurpose, ILoanPurposeRequest } from '../loan-purpose'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: loanPurposeBaseKey,
} = createDataLayerFactory<ILoanPurpose, ILoanPurposeRequest>({
    url: '/api/v1/loan-purpose',
    baseKey: 'loan-purpose',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: loanPurposeAPIRoute, // matches url above

    create: createLoanPurpose,
    updateById: updateLoanPurposeById,

    deleteById: deleteLoanPurposeById,
    deleteMany: deleteManyLoanPurpose,

    getById: getLoanPurposeById,
    getAll: getAllLoanPurpose,
    getPaginated: getPaginatedLoanPurpose,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { loanPurposeBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateLoanPurpose,
    useUpdateById: useUpdateLoanPurposeById,

    useGetAll: useGetAllLoanPurpose,
    useGetById: useGetLoanPurposeById,
    useGetPaginated: useGetPaginatedLoanPurpose,

    useDeleteById: useDeleteLoanPurposeById,
    useDeleteMany: useDeleteManyLoanPurpose,
} = apiCrudHooks

// custom hooks can go here

export const logger = Logger.getInstance('loan-purpose')
