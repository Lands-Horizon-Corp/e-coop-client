import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { ILoanGuide, ILoanGuideRequest } from '../loan-guide'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: loanGuideBaseKey,
} = createDataLayerFactory<ILoanGuide, ILoanGuideRequest>({
    url: '/api/v1/loan-guide',
    baseKey: 'loan-guide',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: loanGuideAPIRoute, // matches url above

    create: createLoanGuide,
    updateById: updateLoanGuideById,

    deleteById: deleteLoanGuideById,
    deleteMany: deleteManyLoanGuide,

    getById: getLoanGuideById,
    getAll: getAllLoanGuide,
    getPaginated: getPaginatedLoanGuide,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { loanGuideBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateLoanGuide,
    useUpdateById: useUpdateLoanGuideById,

    useGetAll: useGetAllLoanGuide,
    useGetById: useGetLoanGuideById,
    useGetPaginated: useGetPaginatedLoanGuide,

    useDeleteById: useDeleteLoanGuideById,
    useDeleteMany: useDeleteManyLoanGuide,
} = apiCrudHooks

export const logger = Logger.getInstance('loan-guide')
// custom hooks can go here
