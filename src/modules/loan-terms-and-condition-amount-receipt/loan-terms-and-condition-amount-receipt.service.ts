import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    ILoanTermsAndConditionAmountReceipt,
    ILoanTermsAndConditionAmountReceiptRequest,
} from '../loan-terms-and-condition-amount-receipt'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: loanTermsAndConditionAmountReceiptBaseKey,
} = createDataLayerFactory<
    ILoanTermsAndConditionAmountReceipt,
    ILoanTermsAndConditionAmountReceiptRequest
>({
    url: '/api/v1/loan-terms-and-condition-amount-receipt',
    baseKey: 'loan-terms-and-condition-amount-receipt',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: loanTermsAndConditionAmountReceiptAPIRoute, // matches url above

    create: createLoanTermsAndConditionAmountReceipt,
    updateById: updateLoanTermsAndConditionAmountReceiptById,

    deleteById: deleteLoanTermsAndConditionAmountReceiptById,
    deleteMany: deleteManyLoanTermsAndConditionAmountReceipt,

    getById: getLoanTermsAndConditionAmountReceiptById,
    getAll: getAllLoanTermsAndConditionAmountReceipt,
    getPaginated: getPaginatedLoanTermsAndConditionAmountReceipt,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { loanTermsAndConditionAmountReceiptBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateLoanTermsAndConditionAmountReceipt,
    useUpdateById: useUpdateLoanTermsAndConditionAmountReceiptById,

    useGetAll: useGetAllLoanTermsAndConditionAmountReceipt,
    useGetById: useGetLoanTermsAndConditionAmountReceiptById,
    useGetPaginated: useGetPaginatedLoanTermsAndConditionAmountReceipt,

    useDeleteById: useDeleteLoanTermsAndConditionAmountReceiptById,
    useDeleteMany: useDeleteManyLoanTermsAndConditionAmountReceipt,
} = apiCrudHooks

// custom hooks can go here

export const logger = Logger.getInstance(
    'loan-terms-and-condition-amount-receipt'
)
