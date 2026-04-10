import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { withCatchAsync } from '@/helpers/function-utils'
import { injectIdempotency } from '@/helpers/indempotency-helpers'
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

import { IGeneralLedger, generalLedgerBaseKey } from '../general-ledger'
import {
    IPaymentQuickRequest,
    IPaymentRequest,
    TPaymentMode,
} from '../quick-transfer'
import {
    ITransaction,
    ITransactionRequest,
    TCreateTransactionPaymentProps,
    TTransactionRequest,
    TUpdateReferenceNumberProps,
} from './transaction.types'

export const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: transactionBaseQueryKey,
} = createDataLayerFactory<ITransaction, ITransactionRequest>({
    url: '/api/v1/transaction',
    baseKey: 'transaction',
})

export const {
    useGetById: useGetTransactionById,
    useGetAll,
    useCreate: useCreateTransaction,
} = apiCrudHooks

export const {
    route: transactionAPIRoute,
    API,
    create,
    getPaginated,
} = apiCrudService

export const useGetCurrentPaymentTransaction = ({
    options,
}: {
    options?: HookQueryOptions<ITransaction, Error>
} = {}) => {
    return useQuery<ITransaction, Error>({
        ...options,
        queryKey: ['current-payment-transaction'],
        queryFn: async () =>
            (await API.get<ITransaction>(`${transactionAPIRoute}/current`))
                .data,
    })
}

export const useCreateTransactionStandalone = createMutationFactory<
    ITransaction,
    Error,
    TTransactionRequest
>({
    mutationFn: async (payload) => {
        const response = await API.post<typeof payload, ITransaction>(
            `${transactionAPIRoute}`,
            payload
        )
        return response.data
    },
    defaultInvalidates: [
        [transactionBaseQueryKey, 'paginated'],
        [transactionBaseQueryKey, 'all'],
    ],
})

export type TPaymentTransactionProps = {
    data: IPaymentRequest
    mode: TPaymentMode
    transactionId?: TEntityId
    transactionPayload?: ITransactionRequest
    idempotencyKey?: string
}

export const createPaymentTransaction = async ({
    data,
    mode,
    transactionId,
    idempotencyKey,
}: TPaymentTransactionProps) => {
    return (
        await API.post<IPaymentRequest, IGeneralLedger>(
            `${transactionAPIRoute}/${transactionId}/${mode}`,
            data,
            {},
            injectIdempotency({ idempotencyKey })
        )
    ).data
}

export const useCreateTransactionPaymentByMode = createMutationFactory<
    IGeneralLedger,
    Error,
    TPaymentTransactionProps
>({
    mutationFn: async ({
        data,
        mode,
        transactionId,
        transactionPayload,
        idempotencyKey,
    }) => {
        if (transactionId) {
            return createPaymentTransaction({
                data,
                mode,
                transactionId,
                idempotencyKey,
            })
        } else {
            const [error, result] = await withCatchAsync(
                create({
                    payload: transactionPayload,
                    config: injectIdempotency({
                        idempotencyKey: idempotencyKey,
                    }),
                })
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
                idempotencyKey,
            })
        }
    },
    invalidationFn: ({ queryClient, variables }) => {
        queryClient.invalidateQueries({
            queryKey: [
                'general-ledger',
                'all',
                transactionBaseQueryKey,
                variables.transactionId,
            ],
        })

        queryClient.invalidateQueries({
            queryKey: ['transaction'],
        })

        queryClient.invalidateQueries({
            queryKey: [
                'member-accounting-ledger',
                'filtered-paginated',
                'member',
                variables.transactionPayload?.member_profile_id,
            ],
        })

        queryClient.invalidateQueries({ queryKey: ['auth', 'context'] })
    },
})

export const useCreateQuickTransactionPayment = createMutationFactory<
    IGeneralLedger,
    Error,
    { data: IPaymentQuickRequest; mode: TPaymentMode; idempotencyKey: string }
>({
    mutationFn: async ({ data, mode, idempotencyKey }) =>
        (
            await API.post<IPaymentQuickRequest, IGeneralLedger>(
                `${transactionAPIRoute}/${mode}`,
                data,
                {},
                injectIdempotency({ idempotencyKey })
            )
        ).data,
    defaultInvalidates: [['transaction-batch']],
    invalidationFn: ({ queryClient, variables }) => {
        queryClient.invalidateQueries({
            queryKey: [
                'member-accounting-ledger',
                'filtered-paginated',
                'member',
                variables.data.member_profile_id,
            ],
        })
        queryClient.invalidateQueries({
            queryKey: ['auth', 'context'],
        })
    },
})

export const usePrintGeneralLedgerTransaction = createMutationFactory<
    IGeneralLedger,
    Error,
    { id: string }
>({
    mutationFn: async ({ id }) =>
        (
            await API.post<void, IGeneralLedger>(
                `${transactionAPIRoute}/general-ledger/${id}/print`
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
                `${transactionAPIRoute}/${transactionId}/payment`,
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
            >(`${transactionAPIRoute}/${transactionId}`, {
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
    { general_ledger_id: TEntityId; idempotencyId: string }
>({
    mutationFn: async ({ general_ledger_id, idempotencyId }) =>
        (
            await API.post<void, IGeneralLedger>(
                `${transactionAPIRoute}/general-ledger/${general_ledger_id}/reverse`,
                undefined,
                undefined,
                {
                    headers: {
                        'X-Idempotency-Key': idempotencyId,
                    },
                }
            )
        ).data,
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({ queryKey: [generalLedgerBaseKey] })
        args.queryClient.invalidateQueries({
            queryKey: [transactionBaseQueryKey],
        })
        createMutationInvalidateFn('single-reverse-transaction', args)
    },
})

export const useAllReverseTransaction = createMutationFactory<
    IGeneralLedger,
    Error,
    { transaction_id: TEntityId; idempotencyKey: string }
>({
    mutationFn: async ({ transaction_id, idempotencyKey }) =>
        (
            await API.post<void, IGeneralLedger>(
                `${transactionAPIRoute}/${transaction_id}/reverse`,
                undefined,
                undefined,
                injectIdempotency({ idempotencyKey })
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
    {
        transactionId: TEntityId
        payments: IPaymentRequest[]
        idempotencyId: string
    }
>({
    mutationFn: async ({ payments, transactionId, idempotencyId }) =>
        (
            await API.post<IPaymentRequest[], IGeneralLedger>(
                `${transactionAPIRoute}/${transactionId}/multipayment`,
                payments,
                {},
                {
                    headers: {
                        'X-Idempotency-Key': idempotencyId,
                    },
                }
            )
        ).data,
    invalidationFn: (args) => {
        createMutationInvalidateFn('transaction', args)
        createMutationInvalidateFn('general-ledger', args)
    },
})

// export const useCreateSingleTransactionPayment = createMutationFactory<
//     IGeneralLedger,
//     Error,
//     { transactionId: TEntityId; data: IPaymentRequest }
// >({
//     mutationFn: async ({ data, transactionId }) => {
//         const response = await createPaymentTransaction({
//             mode: 'payment',
//             transactionId,
//             data: data,
//         })
//         return response
//     },
//     invalidationFn: (args) => {
//         createMutationInvalidateFn('transaction', args)
//         createMutationInvalidateFn('general-ledger', args)
//     },
// })
