import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { TransactionService } from '@/api-service/transaction-service'
import {
    createMutationHook,
    createMutationInvalidateFn,
    createQueryHook,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IGeneralLedger,
    IPaymentQuickRequest,
    IPaymentRequest,
    IQueryProps,
    ITransactionPaginated,
    ITransactionRequest,
    ITransactionResponse,
    TEntityId,
} from '@/types'

export type TTransactionMode =
    | 'current-branch'
    | 'current-user'
    | 'member-profile'
    | 'employee'
    | 'transaction-batch'

export type TTransactionHookProps = {
    mode: TTransactionMode

    // Optional parameters based on mode
    userId?: TEntityId
    memberProfileId?: TEntityId
    transactionBatchId?: TEntityId
} & IAPIFilteredPaginatedHook<ITransactionPaginated, string> &
    IQueryProps

const ENTITY_KEY = 'transaction'

export const useFilteredPaginatedTransaction = ({
    mode = 'current-branch',
    userId,
    memberProfileId,
    transactionBatchId,
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
    ...other
}: TTransactionHookProps) => {
    const queryKey = [
        'transaction-tag',
        'resource-query',
        mode,
        memberProfileId,
        userId,
        transactionBatchId,
        filterPayload,
        pagination,
        sort,
    ].filter(Boolean)

    return useQuery<ITransactionPaginated, string>({
        queryKey,
        queryFn: async () => {
            const params = {
                pagination,
                sort: sort && toBase64(sort),
                filters: filterPayload && toBase64(filterPayload),
            }

            let serviceCall: Promise<ITransactionPaginated>
            let targetUrl: string

            switch (mode) {
                case 'current-branch':
                    targetUrl = 'branch/search'
                    serviceCall = TransactionService.search({
                        targetUrl,
                        ...params,
                    })
                    break

                case 'current-user':
                    targetUrl = 'current/search'
                    serviceCall = TransactionService.search({
                        targetUrl,
                        ...params,
                    })
                    break

                case 'member-profile':
                    if (!memberProfileId)
                        throw new Error(
                            'memberProfileId is required for member-profile mode'
                        )
                    targetUrl = `member-profile/${memberProfileId}/search`
                    serviceCall = TransactionService.search({
                        targetUrl,
                        ...params,
                    })
                    break

                case 'employee':
                    if (!userId)
                        throw new Error('userId is required for employee mode')
                    targetUrl = `employee/${userId}/search`
                    serviceCall = TransactionService.search({
                        targetUrl,
                        ...params,
                    })
                    break

                case 'transaction-batch':
                    if (!transactionBatchId)
                        throw new Error(
                            'transactionBatchId is required for transaction-batch mode'
                        )
                    targetUrl = `transaction-batch/${transactionBatchId}/search`
                    serviceCall = TransactionService.search({
                        targetUrl,
                        ...params,
                    })
                    break

                default:
                    throw new Error(`Unsupported mode: ${mode}`)
            }

            const [error, result] = await withCatchAsync(serviceCall)

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
        ...other,
    })
}

export const useCreateTransaction = createMutationHook<
    ITransactionResponse,
    string,
    ITransactionRequest
>(
    (payload) => TransactionService.create(payload),
    'New Transaction Created',
    (args) => createMutationInvalidateFn(ENTITY_KEY, args)
)

export const useUpdateTransaction = createMutationHook<
    ITransactionResponse,
    string,
    {
        transactionId: TEntityId
        data: ITransactionRequest
    }
>(
    (payload) =>
        TransactionService.updateById(payload.transactionId, payload.data),
    'Transaction Updated',
    (args) => createMutationInvalidateFn(ENTITY_KEY, args)
)

export const useGetTransactionById = ({
    transactionId,
    onError,
    onSuccess,
    ...opts
}: { transactionId: TEntityId } & IAPIHook<ITransactionResponse, string> &
    IQueryProps<ITransactionResponse>) => {
    return useQuery<ITransactionResponse, string>({
        queryKey: ['get-transaction-by-id', transactionId],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                TransactionService.getById(transactionId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(data)
            return data
        },
        ...opts,
    })
}

export const useGetCurrentTransaction = createQueryHook<ITransactionResponse[]>(
    ['current-transaction-list', 'current-transaction'],
    () => TransactionService.getCurrentPaymentTransaction()
)

export const useCreatePaymentTransaction = createMutationHook<
    IGeneralLedger,
    string,
    {
        data: IPaymentRequest
        transactionId: TEntityId
    }
>(
    (payload) =>
        TransactionService.createPaymentTransaction(
            payload.data,
            payload.transactionId
        ),
    'Payment Transaction Created',
    (args) => createMutationInvalidateFn(ENTITY_KEY, args)
)

export const usecreateQuickTransactionPayment = createMutationHook<
    IGeneralLedger,
    string,
    {
        data: IPaymentQuickRequest
        mode: string
    }
>(
    (payload) =>
        TransactionService.createQuickTransactionPayment({
            data: payload.data,
            mode: payload.mode,
        }),
    'Quick Transaction Payment Created',
    (args) => createMutationInvalidateFn(ENTITY_KEY, args)
)

export const useFilteredCurrentPaginatedTransaction = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 0 },
    ...other
}: IAPIFilteredPaginatedHook<ITransactionPaginated, string> & IQueryProps) => {
    return useQuery<ITransactionPaginated, string>({
        queryKey: [
            'current-transaction-list',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TransactionService.getPaginatedCurrentTransaction({
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
        ...other,
    })
}

export const useUpdateReferenceNumber = createMutationHook<
    ITransactionResponse,
    string,
    {
        transactionId: TEntityId
        reference_number: string
        description: string
    }
>(
    (payload) =>
        TransactionService.updateReferenceNumber(
            payload.transactionId,
            payload.reference_number,
            payload.description
        ),
    'Reference Number Updated',
    (args) => updateMutationInvalidationFn('get-transaction-by-id', args)
)
