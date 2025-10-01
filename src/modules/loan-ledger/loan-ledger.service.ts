import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { ILoanLedger, ILoanLedgerRequest } from '../loan-ledger'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: loanLedgerBaseKey,
} = createDataLayerFactory<ILoanLedger, ILoanLedgerRequest>({
    url: '/api/v1/loan-ledger',
    baseKey: 'loan-ledger',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: loanLedgerAPIRoute, // matches url above

    create: createLoanLedger,
    updateById: updateLoanLedgerById,

    deleteById: deleteLoanLedgerById,
    deleteMany: deleteManyLoanLedger,

    getById: getLoanLedgerById,
    getAll: getAllLoanLedger,
    getPaginated: getPaginatedLoanLedger,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { loanLedgerBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateLoanLedger,
    useUpdateById: useUpdateLoanLedgerById,

    useGetAll: useGetAllLoanLedger,
    useGetById: useGetLoanLedgerById,
    useGetPaginated: useGetPaginatedLoanLedger,

    useDeleteById: useDeleteLoanLedgerById,
    useDeleteMany: useDeleteManyLoanLedger,
} = apiCrudHooks

// custom hooks can go here
