import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { ILoanStatus, ILoanStatusRequest } from '../loan-status'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: loanStatusBaseKey,
} = createDataLayerFactory<ILoanStatus, ILoanStatusRequest>({
    url: '/api/v1/loan-status',
    baseKey: 'loan-status',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: loanStatusAPIRoute, // matches url above

    create: createLoanStatus,
    updateById: updateLoanStatusById,

    deleteById: deleteLoanStatusById,
    deleteMany: deleteManyLoanStatus,

    getById: getLoanStatusById,
    getAll: getAllLoanStatus,
    getPaginated: getPaginatedLoanStatus,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { loanStatusBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateLoanStatus,
    useUpdateById: useUpdateLoanStatusById,

    useGetAll: useGetAllLoanStatus,
    useGetById: useGetLoanStatusById,
    useGetPaginated: useGetPaginatedLoanStatus,

    useDeleteById: useDeleteLoanStatusById,
    useDeleteMany: useDeleteManyLoanStatus,
} = apiCrudHooks

// custom hooks can go here

export const logger = Logger.getInstance('loan-status')
