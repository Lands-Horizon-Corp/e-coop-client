import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    ILoanTermsAndConditionSuggestedPayment,
    ILoanTermsAndConditionSuggestedPaymentRequest,
} from '../loan-terms-and-condition-suggested-payment'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: loanTermsAndConditionSuggestedPaymentBaseKey,
} = createDataLayerFactory<
    ILoanTermsAndConditionSuggestedPayment,
    ILoanTermsAndConditionSuggestedPaymentRequest
>({
    url: '/api/v1/loan-terms-and-condition-suggested-payment',
    baseKey: 'loan-terms-and-condition-suggested-payment',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: loanTermsAndConditionSuggestedPaymentAPIRoute, // matches url above

    create: createLoanTermsAndConditionSuggestedPayment,
    updateById: updateLoanTermsAndConditionSuggestedPaymentById,

    deleteById: deleteLoanTermsAndConditionSuggestedPaymentById,
    deleteMany: deleteManyLoanTermsAndConditionSuggestedPayment,

    getById: getLoanTermsAndConditionSuggestedPaymentById,
    getAll: getAllLoanTermsAndConditionSuggestedPayment,
    getPaginated: getPaginatedLoanTermsAndConditionSuggestedPayment,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { loanTermsAndConditionSuggestedPaymentBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateLoanTermsAndConditionSuggestedPayment,
    useUpdateById: useUpdateLoanTermsAndConditionSuggestedPaymentById,

    useGetAll: useGetAllLoanTermsAndConditionSuggestedPayment,
    useGetById: useGetLoanTermsAndConditionSuggestedPaymentById,
    useGetPaginated: useGetPaginatedLoanTermsAndConditionSuggestedPayment,

    useDeleteById: useDeleteLoanTermsAndConditionSuggestedPaymentById,
    useDeleteMany: useDeleteManyLoanTermsAndConditionSuggestedPayment,
} = apiCrudHooks

// custom hooks can go here

export const logger = Logger.getInstance(
    'loan-terms-and-condition-suggested-payment'
)
