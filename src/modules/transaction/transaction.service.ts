import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { withCatchAsync } from '@/helpers/function-utils'
import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    createMutationInvalidateFn,
} from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import { IGeneralLedger, IGeneralLedgerResponse } from '../general-ledger'
import {
    IPaymentQuickRequest,
    IPaymentRequest,
    TPaymentMode,
} from '../quick-transfer'
import {
    ITransaction,
    ITransactionRequest,
    TCreateTransactionPaymentProps,
    TUpdateReferenceNumberProps,
} from './transaction.types'

export const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    ITransaction,
    ITransactionRequest
>({ url: '/api/v1/transaction', baseKey: 'transaction' })

export const {
    useGetById,
    useGetAll,
    useCreate: useCreateTransaction,
} = apiCrudHooks

export const { route, API, create, getPaginated } = apiCrudService

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
            const [error, result] = await withCatchAsync(
                create({ payload: transactionPayload })
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw new Error(errorMessage)
            }
            return createPaymentTransaction({
                data,
                mode,
                transactionId: result.id,
            })
        }
    },
    invalidationFn: (args) =>
        createMutationInvalidateFn('general-ledger', args),
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
            await API.post<void, IGeneralLedgerResponse>(
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

// POST - /api/v1/transaction/general-ledger/:general_ledger_id/reverse (Single)
// POST - /api/v1/transaction/:transaction_id/reverse (All)

export const useSingleReverseTransaction = createMutationFactory<
    IGeneralLedger,
    Error,
    { general_ledger_id: TEntityId }
>({
    mutationFn: async ({ general_ledger_id }) =>
        (
            await API.post<void, IGeneralLedger>(
                `${route}/general-ledger/${general_ledger_id}/reverse`
            )
        ).data,
    invalidationFn: (args) =>
        createMutationInvalidateFn('single-reverse-transaction', args),
})

export const useAllReverseTransaction = createMutationFactory<
    IGeneralLedger,
    Error,
    { transaction_id: TEntityId }
>({
    mutationFn: async ({ transaction_id }) =>
        (
            await API.post<void, IGeneralLedger>(
                `${route}/${transaction_id}/reverse`
            )
        ).data,
    invalidationFn: (args) =>
        createMutationInvalidateFn('all-reverse-transaction', args),
})

export const logger = Logger.getInstance('transaction')

// For Jervx Loan Payment Multiple Payable Account since loan may have multiple accounts
// to be paid
export const useCreateMultiTransactionPayment = createMutationFactory<
    IGeneralLedger,
    Error,
    { transactionId: TEntityId; payments: IPaymentRequest[] }
>({
    mutationFn: async ({ payments, transactionId }) =>
        (
            await API.post<IPaymentRequest[], IGeneralLedger>(
                `${route}/${transactionId}/multi-payment`,
                payments
            )
        ).data,
    invalidationFn: (args) => {
        createMutationInvalidateFn('transaction', args)
        createMutationInvalidateFn('general-ledger', args)
    },
})
