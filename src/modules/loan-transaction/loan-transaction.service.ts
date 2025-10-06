import { useQuery } from '@tanstack/react-query'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import { IAmortizationSchedule } from '../amortization'
import type {
    ILoanTransaction,
    ILoanTransactionPaginated,
    ILoanTransactionPrintRequest,
    ILoanTransactionRequest,
    ILoanTransactionSignatureRequest,
} from '../loan-transaction'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: loanTransactionBaseKey,
} = createDataLayerFactory<ILoanTransaction, ILoanTransactionRequest>({
    url: '/api/v1/loan-transaction',
    baseKey: 'loan-transaction',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: loanTransactionAPIRoute, // matches url above

    create: createLoanTransaction,
    updateById: updateLoanTransactionById,

    deleteById: deleteLoanTransactionById,
    deleteMany: deleteManyLoanTransaction,

    getById: getLoanTransactionById,
    getAll: getAllLoanTransaction,
    getPaginated: getPaginatedLoanTransaction,
} = apiCrudService

// custom service functions can go here

// for signing loan transaction signatures
export const updateLoanTransactionSignature = async ({
    id,
    payload,
}: {
    id: TEntityId
    payload: ILoanTransactionSignatureRequest
}) => {
    const response = await API.put<
        ILoanTransactionSignatureRequest,
        ILoanTransaction
    >(`${loanTransactionAPIRoute}/${id}/signature`, payload)
    return response.data
}

// for printing loan transaction
export const printLoanTransaction = async ({
    loanTransactionId,
    payload,
}: {
    loanTransactionId: TEntityId
    payload: ILoanTransactionPrintRequest
}) => {
    const response = await API.put<
        ILoanTransactionPrintRequest,
        ILoanTransaction
    >(`${loanTransactionAPIRoute}/${loanTransactionId}/print`, payload)
    return response.data
}

// 🪝 HOOK STARTS HERE
export { loanTransactionBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateLoanTransaction,
    useUpdateById: useUpdateLoanTransactionById,

    useGetAll: useGetAllLoanTransaction,
    useGetById: useGetLoanTransactionById,
    // useGetPaginated: useGetPaginatedLoanTransaction,

    useDeleteById: useDeleteLoanTransactionById,
    useDeleteMany: useDeleteManyLoanTransaction,
} = apiCrudHooks

// custom hooks can go here

export type TLoanTransactionHookMode = 'branch' | 'member-profile'

export const useGetPaginatedLoanTransaction = ({
    mode = 'branch',

    memberProfileId,

    query,
    options,
}: {
    mode: TLoanTransactionHookMode
    memberProfileId?: TEntityId

    query?: TAPIQueryOptions
    options?: HookQueryOptions<ILoanTransactionPaginated, Error>
}) => {
    return useQuery<ILoanTransactionPaginated, Error>({
        ...options,
        queryKey: [
            loanTransactionBaseKey,
            'paginated',
            mode,
            memberProfileId,
            query,
        ].filter(Boolean),
        queryFn: async () => {
            let url = `${loanTransactionAPIRoute}/search`

            if (mode === 'member-profile') {
                url = `${loanTransactionAPIRoute}/member-profile/${memberProfileId}/search`
            }

            return getPaginatedLoanTransaction({ url, query })
        },
    })
}

// GET LOAN AMORT
export const useGetLoanAmortization = ({
    loanTransactionId,
    options,
}: {
    loanTransactionId: TEntityId
    options?: HookQueryOptions<IAmortizationSchedule, Error>
}) => {
    return useQuery<IAmortizationSchedule, Error>({
        ...options,
        queryKey: [loanTransactionBaseKey, loanTransactionId, 'amortization'],
        queryFn: async () => {
            const response = await API.get<IAmortizationSchedule>(
                `${loanTransactionAPIRoute}/${loanTransactionId}/amortization-schedule`
            )

            return response.data
        },
    })
}

//  SIGNATURE
export const useUpdateLoanTransactionSignature = createMutationFactory<
    ILoanTransaction,
    Error,
    { id: TEntityId; payload: ILoanTransactionSignatureRequest }
>({
    mutationFn: (data) => updateLoanTransactionSignature(data),
    invalidationFn: (args) =>
        updateMutationInvalidationFn(loanTransactionBaseKey, args),
})

// PRINT
export const usePrintLoanTransaction = createMutationFactory<
    ILoanTransaction,
    Error,
    { loanTransactionId: TEntityId; payload: ILoanTransactionPrintRequest }
>({
    mutationFn: (data) => printLoanTransaction(data),
    invalidationFn: (args) =>
        updateMutationInvalidationFn(loanTransactionBaseKey, args),
})

// RE-PRINT

export const useReprintLoanTransaction = createMutationFactory<
    ILoanTransaction,
    Error,
    { loanTransactionId: TEntityId }
>({
    mutationFn: async (data) => {
        const response = await API.put<void, ILoanTransaction>(
            `${loanTransactionAPIRoute}/${data.loanTransactionId}/print-only`
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(loanTransactionBaseKey, args),
})

// UNDO PRINT

export const useUndoPrintLoanTransaction = createMutationFactory<
    ILoanTransaction,
    Error,
    { loanTransactionId: TEntityId }
>({
    mutationFn: async (data) => {
        const response = await API.put<void, ILoanTransaction>(
            `${loanTransactionAPIRoute}/${data.loanTransactionId}/print-undo`
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(loanTransactionBaseKey, args),
})

// APROVE LOAN
export const useApproveLoanTransaction = createMutationFactory<
    ILoanTransaction,
    Error,
    { loanTransactionId: TEntityId }
>({
    mutationFn: async (data) => {
        const response = await API.put<void, ILoanTransaction>(
            `${loanTransactionAPIRoute}/${data.loanTransactionId}/approve`
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(loanTransactionBaseKey, args),
})

// UNDO APPROVE
export const useUndoApproveLoanTransaction = createMutationFactory<
    ILoanTransaction,
    Error,
    { loanTransactionId: TEntityId }
>({
    mutationFn: async (data) => {
        const response = await API.put<void, ILoanTransaction>(
            `${loanTransactionAPIRoute}/${data.loanTransactionId}/approve-undo`
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(loanTransactionBaseKey, args),
})

// RELEASE LOAN
export const useReleaseLoanTransaction = createMutationFactory<
    ILoanTransaction,
    Error,
    { loanTransactionId: TEntityId }
>({
    mutationFn: async (data) => {
        const response = await API.put<void, ILoanTransaction>(
            `${loanTransactionAPIRoute}/${data.loanTransactionId}/release`
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(loanTransactionBaseKey, args),
})

// Change Cash Account
export const useLoanTransactionChangeCashEquivalenceAccount =
    createMutationFactory<
        ILoanTransaction,
        Error,
        { loanTransactionId: TEntityId; cashAccountId: TEntityId }
    >({
        mutationFn: async (data) => {
            const response = await API.put<void, ILoanTransaction>(
                `${loanTransactionAPIRoute}/${data.loanTransactionId}/cash-and-cash-equivalence-account/${data.cashAccountId}/change`
            )
            return response.data
        },
        invalidationFn: (args) =>
            updateMutationInvalidationFn(loanTransactionBaseKey, args),
    })
