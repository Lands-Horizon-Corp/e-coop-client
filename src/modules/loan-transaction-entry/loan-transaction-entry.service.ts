import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    ILoanTransactionEntry,
    ILoanTransactionEntryRequest,
} from '../loan-transaction-entry'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: loanTransactionEntryBaseKey,
} = createDataLayerFactory<ILoanTransactionEntry, ILoanTransactionEntryRequest>(
    {
        url: '/api/v1/loan-transaction-entry',
        baseKey: 'loan-transaction-entry',
    }
)

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: loanTransactionEntryAPIRoute, // matches url above

    create: createLoanTransactionEntry,
    updateById: updateLoanTransactionEntryById,

    deleteById: deleteLoanTransactionEntryById,
    deleteMany: deleteManyLoanTransactionEntry,

    getById: getLoanTransactionEntryById,
    getAll: getAllLoanTransactionEntry,
    getPaginated: getPaginatedLoanTransactionEntry,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { loanTransactionEntryBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateLoanTransactionEntry,
    useUpdateById: useUpdateLoanTransactionEntryById,

    useGetAll: useGetAllLoanTransactionEntry,
    useGetById: useGetLoanTransactionEntryById,
    useGetPaginated: useGetPaginatedLoanTransactionEntry,

    useDeleteById: useDeleteLoanTransactionEntryById,
    useDeleteMany: useDeleteManyLoanTransactionEntry,
} = apiCrudHooks

// custom hooks can go here
