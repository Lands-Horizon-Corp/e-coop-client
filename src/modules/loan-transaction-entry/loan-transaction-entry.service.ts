import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import type {
    ILoanTransactionEntry,
    ILoanTransactionEntryRequest,
} from '../loan-transaction-entry'
import { loanTransactionBaseKey } from '../loan-transaction/loan-transaction.service'
import { ILoanTransaction } from '../loan-transaction/loan-transaction.types'

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
    // useCreate: useCreateLoanTransactionEntry,
    // useUpdateById: useUpdateLoanTransactionEntryById,

    useGetAll: useGetAllLoanTransactionEntry,
    useGetById: useGetLoanTransactionEntryById,
    useGetPaginated: useGetPaginatedLoanTransactionEntry,

    // useDeleteById: useDeleteLoanTransactionEntryById,
    useDeleteMany: useDeleteManyLoanTransactionEntry,
} = apiCrudHooks

// custom hooks can go here

export const useCreateLoanTransactionEntry = createMutationFactory<
    ILoanTransactionEntry,
    Error,
    { loanTransactionId: TEntityId; payload: ILoanTransactionEntryRequest }
>({
    mutationFn: ({ loanTransactionId, payload }) =>
        createLoanTransactionEntry({
            url: `${loanTransactionEntryAPIRoute}/loan-transaction/${loanTransactionId}/deduction`,
            payload,
        }),
    invalidationFn: (props) => {
        createMutationInvalidateFn(loanTransactionEntryBaseKey, props)
        props.queryClient.invalidateQueries({
            queryKey: [loanTransactionBaseKey, 'paginated'],
        })
        props.queryClient.invalidateQueries({
            queryKey: [
                loanTransactionBaseKey,
                props.resultData.loan_transaction_id,
            ],
        })
    },
    defaultInvalidates: [
        [loanTransactionEntryBaseKey, 'paginated'],
        [loanTransactionEntryBaseKey, 'all'],
    ],
})

export const useUpdateLoanTransactionEntryById = createMutationFactory<
    ILoanTransactionEntry,
    Error,
    { id: TEntityId; payload: ILoanTransactionEntryRequest }
>({
    mutationFn: ({ id, payload }) =>
        updateLoanTransactionEntryById({
            url: `${loanTransactionEntryAPIRoute}/${id}/deduction`,
            id,
            payload,
        }),
    invalidationFn: (props) => {
        updateMutationInvalidationFn(loanTransactionEntryBaseKey, props)
        props.queryClient.invalidateQueries({
            queryKey: [loanTransactionBaseKey, 'paginated'],
        })
        props.queryClient.invalidateQueries({
            queryKey: [
                loanTransactionBaseKey,
                props.resultData.loan_transaction_id,
            ],
        })
    },
})

export const useDeleteLoanTransactionEntryById = createMutationFactory<
    void,
    Error,
    TEntityId
>({
    mutationFn: (id) => deleteLoanTransactionEntryById({ id }),
    invalidationFn: (props) => {
        deleteMutationInvalidationFn(loanTransactionEntryBaseKey, props)
        props.queryClient.invalidateQueries({
            queryKey: [loanTransactionBaseKey, 'paginated'],
        })
    },
})

export const useLoanTransactionEntryRestoreById = createMutationFactory<
    ILoanTransaction,
    Error,
    TEntityId
>({
    mutationFn: async (id) => {
        const response = await API.put<void, ILoanTransaction>(
            `${loanTransactionEntryAPIRoute}/${id}/restore`
        )
        return response.data
    },
    invalidationFn: (props) => {
        deleteMutationInvalidationFn(loanTransactionEntryBaseKey, props)
        props.queryClient.invalidateQueries({
            queryKey: [loanTransactionBaseKey, 'paginated'],
        })
    },
})

export const logger = Logger.getInstance('loan-transaction-entry')
