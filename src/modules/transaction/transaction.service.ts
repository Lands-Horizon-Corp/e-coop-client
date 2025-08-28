import { useQuery } from '@tanstack/react-query'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    createMutationInvalidateFn,
} from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import { IGeneralLedger, IGeneralLedgerResponse } from '../general-ledger'
import {
    IPaymentQuickRequest,
    IPaymentRequest,
    ITransaction,
    ITransactionPaginated,
    ITransactionRequest,
    TCreateTransactionPaymentProps,
    TPaymentMode,
    TUpdateReferenceNumberProps,
} from './transaction.types'

export const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    ITransaction,
    ITransactionRequest
>({ url: '/api/v1/transaction', baseKey: 'transaction' })

export const { useGetById, useGetAll, useCreate } = apiCrudHooks

const { route, API, getPaginated, create } = apiCrudService

export type TTransactionHookMode =
    | 'current-branch'
    | 'current-user'
    | 'member-profile'
    | 'employee'
    | 'transaction-batch'
export const useFilteredPaginatedTransaction = ({
    mode = 'current-branch', // Default mode
    userId,
    memberProfileId,
    transactionBatchId,
    query,
    options,
}: {
    mode?: TTransactionHookMode
    userId?: string
    memberProfileId?: string
    transactionBatchId?: string
    query?: TAPIQueryOptions
    options?: HookQueryOptions<ITransactionPaginated, Error>
}) => {
    return useQuery<ITransactionPaginated, Error>({
        ...options,
        queryKey: [
            'transaction',
            'resource-query',
            mode,
            memberProfileId,
            userId,
            transactionBatchId,
            query,
        ].filter(Boolean),
        queryFn: async () => {
            let url: string

            switch (mode) {
                case 'current-branch':
                    url = `${route}/branch/search`
                    break

                case 'current-user':
                    url = `${route}/current/search`
                    break

                case 'member-profile':
                    if (!memberProfileId) {
                        throw new Error(
                            'memberProfileId is required for member-profile mode'
                        )
                    }
                    url = `${route}/member-profile/${memberProfileId}/search`
                    break

                case 'employee':
                    if (!userId) {
                        throw new Error('userId is required for employee mode')
                    }
                    url = `${route}/employee/${userId}/search`
                    break

                case 'transaction-batch':
                    if (!transactionBatchId) {
                        throw new Error(
                            'transactionBatchId is required for transaction-batch mode'
                        )
                    }
                    url = `${route}/transaction-batch/${transactionBatchId}/search`
                    break

                default:
                    throw new Error(`Unsupported mode: ${mode}`)
            }

            return getPaginated({
                url,
                query,
            })
        },
    })
}

export const useGetCurrentPaymentTransaction = ({
    options,
}: {
    options?: HookQueryOptions<ITransaction, Error>
} = {}) => {
    return useQuery<ITransaction, Error>({
        ...options,
        queryKey: ['current-payment-transaction'],
        queryFn: async () =>
            (await API.get<ITransaction>(`${route}/current`)).data,
    })
}

type TPaymentTransactionProps = {
    data: IPaymentRequest
    mode: TPaymentMode
    transactionId?: TEntityId
    transactionPayload?: ITransactionRequest
}

export const createPaymentTransaction = async ({
    data,
    mode,
    transactionId,
}: TPaymentTransactionProps) => {
    return (
        await API.post<IPaymentRequest, IGeneralLedger>(
            `${route}/${transactionId}/${mode}`,
            data
        )
    ).data
}

export const useCreateTransactionPaymentByMode = createMutationFactory<
    IGeneralLedger,
    Error,
    TPaymentTransactionProps
>({
    mutationFn: async ({ data, mode, transactionId, transactionPayload }) => {
        if (transactionId) {
            return createPaymentTransaction({ data, mode, transactionId })
        } else {
            return create({ payload: transactionPayload })
        }
    },
    invalidationFn: (args) =>
        createMutationInvalidateFn('create-transaction-payment-by-mode', args),
})

export const useCreateQuickTransactionPayment = createMutationFactory<
    IGeneralLedger,
    Error,
    { data: IPaymentQuickRequest; mode: TPaymentMode }
>({
    mutationFn: async ({ data, mode }) =>
        (
            await API.post<IPaymentQuickRequest, IGeneralLedger>(
                `${route}/${mode}`,
                data
            )
        ).data,
    invalidationFn: (args) =>
        createMutationInvalidateFn('general-ledger', args),
})

export const usePrintGeneralLedgerTransaction = createMutationFactory<
    IGeneralLedgerResponse,
    Error,
    { id: string }
>({
    mutationFn: async ({ id }) =>
        (
            await API.get<IGeneralLedgerResponse>(
                `${route}/general-ledger/${id}/print`
            )
        ).data,
})

export const useCreateTransactionPayment = createMutationFactory<
    IGeneralLedger,
    Error,
    TCreateTransactionPaymentProps
>({
    mutationFn: async ({ data, transactionId }) =>
        (
            await API.post<IPaymentRequest, IGeneralLedger>(
                `${route}/${transactionId}/payment`,
                data
            )
        ).data,
    invalidationFn: (args) =>
        createMutationInvalidateFn('create-transaction-payment', args),
})

export const useUpdateReferenceNumber = createMutationFactory<
    ITransaction,
    Error,
    TUpdateReferenceNumberProps
>({
    mutationFn: async ({ transactionId, reference_number, description }) =>
        (
            await API.put<
                { reference_number: string; description: string },
                ITransaction
            >(`${route}/${transactionId}`, {
                reference_number,
                description,
            })
        ).data,
    invalidationFn: (args) =>
        createMutationInvalidateFn('update-reference-number-transaction', args),
})
