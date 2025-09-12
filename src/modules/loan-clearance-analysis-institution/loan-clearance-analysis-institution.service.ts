import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    ILoanClearanceAnalysisInstitution,
    ILoanClearanceAnalysisInstitutionRequest,
} from '../loan-clearance-analysis-institution'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: loanClearanceAnalysisInstitutionBaseKey,
} = createDataLayerFactory<
    ILoanClearanceAnalysisInstitution,
    ILoanClearanceAnalysisInstitutionRequest
>({
    url: '/api/v1/loan-clearance-analysis-institution',
    baseKey: 'loan-clearance-analysis-institution',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: loanClearanceAnalysisInstitutionAPIRoute, // matches url above

    create: createLoanClearanceAnalysisInstitution,
    updateById: updateLoanClearanceAnalysisInstitutionById,

    deleteById: deleteLoanClearanceAnalysisInstitutionById,
    deleteMany: deleteManyLoanClearanceAnalysisInstitution,

    getById: getLoanClearanceAnalysisInstitutionById,
    getAll: getAllLoanClearanceAnalysisInstitution,
    getPaginated: getPaginatedLoanClearanceAnalysisInstitution,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { loanClearanceAnalysisInstitutionBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateLoanClearanceAnalysisInstitution,
    useUpdateById: useUpdateLoanClearanceAnalysisInstitutionById,

    useGetAll: useGetAllLoanClearanceAnalysisInstitution,
    useGetById: useGetLoanClearanceAnalysisInstitutionById,
    useGetPaginated: useGetPaginatedLoanClearanceAnalysisInstitution,

    useDeleteById: useDeleteLoanClearanceAnalysisInstitutionById,
    useDeleteMany: useDeleteManyLoanClearanceAnalysisInstitution,
} = apiCrudHooks

// custom hooks can go here
