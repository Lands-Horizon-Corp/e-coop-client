import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import TransactionBatchService from '@/api-service/transaction-batch-service'
import { isArray, serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IQueryProps,
    ITransactionBatch,
    ITransactionBatchDepositInBankRequest,
    ITransactionBatchEndRequest,
    ITransactionBatchMinimal,
    ITransactionBatchPaginated,
    ITransactionBatchRequest,
    ITransactionBatchSignatures,
    TEntityId,
    TTransactionBatchFullorMin,
} from '@/types'

import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '../../factory/api-hook-factory'

export const useCurrentTransactionBatch = ({
    enabled,
    onError,
    onSuccess,
    showMessage = true,
}: IAPIHook<TTransactionBatchFullorMin> & IQueryProps = {}) => {
    return useQuery<TTransactionBatchFullorMin, string>({
        queryKey: ['transaction-batch', 'current'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TransactionBatchService.currentTransactionBatch()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                onError?.(errorMessage, error)
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            onSuccess?.(result)
            return result
        },
        enabled,
        retry: 1,
    })
}

export const useTransactionBatch = <TData = ITransactionBatch>({
    id,
    enabled,
    showMessage = true,
}: IAPIHook<TData, string> & IQueryProps & { id: TEntityId }) => {
    return useQuery<TData, string>({
        queryKey: ['transaction-batch', id],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TransactionBatchService.getById<TData>(id)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        enabled,
        retry: 1,
    })
}

export const useCreateTransactionBatch = createMutationHook<
    ITransactionBatchMinimal,
    string,
    ITransactionBatchRequest
>(
    (variables) => TransactionBatchService.create(variables),
    'Transaction batch created.',
    (args) => createMutationInvalidateFn('transaction-batch', args)
)

export const useDeleteTransactionBatch = createMutationHook<
    void,
    string,
    TEntityId
>(
    (transactionBatchId) =>
        TransactionBatchService.deleteById(transactionBatchId),
    'Transaction batch deleted',
    (args) => deleteMutationInvalidationFn('transaction-batch', args)
)

export const useTransactionBatchRequestBlotterView = createMutationHook<
    ITransactionBatchMinimal,
    string,
    TEntityId
>(
    (id) => TransactionBatchService.requestTransactionBatchBlotterView(id),
    'Requested batch view'
)

export const useTransactionBatchSetDepositInBank = createMutationHook<
    ITransactionBatchMinimal | ITransactionBatch,
    string,
    { id: TEntityId; data: ITransactionBatchDepositInBankRequest }
>(
    ({ id, data }) => TransactionBatchService.setDepositInBank(id, data),
    'Deposit in bank Saved'
)

export const useTransactionBatchEndCurrentBatch = createMutationHook<
    TTransactionBatchFullorMin,
    string,
    ITransactionBatchEndRequest
>(
    (data) => TransactionBatchService.endCurrentBatch(data),
    'Transaction Batch Ended'
)

export const useFilteredPaginatedTransactionBatch = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<ITransactionBatchPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<ITransactionBatchPaginated, string>({
        queryKey: [
            'transaction-batch',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TransactionBatchService.search({
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
    })
}

// GET ALL TRANSACTION BATCH BLOTTER VIEW REQUEST
export const useTransactionBatchBlotterViewRequests = ({
    enabled,
    initialData,
    showMessage = true,
    ...other
}: IAPIHook<ITransactionBatch> & IQueryProps<ITransactionBatch[]> = {}) => {
    return useQuery({
        queryKey: ['transaction-batch', 'view-requests'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TransactionBatchService.getAllTransactionBatchViewRequest()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                other.onError?.(errorMessage, error)
                throw errorMessage
            }

            return isArray(result) ? result : []
        },
        enabled,
        ...other,
        retry: 1,
        initialData: initialData ?? [],
    })
}

// APPROVE A SPECIFIC TRANSACTION BATCH BLOTTER VIEW
export const useTransactionBatchAcceptBlotterView = createMutationHook<
    ITransactionBatch,
    string,
    TEntityId
>(
    (id) => TransactionBatchService.allowBlotterView(id),
    'Batch view allowed',
    (args) => updateMutationInvalidationFn('transaction-batch', args)
)

// GET ALL ENDED BATCH THAT CAN BE SIGNED BY OTHER
export const useTransactionBatchEndApprovals = ({
    enabled,
    showMessage = true,
    ...other
}: IAPIHook<ITransactionBatch[]> & IQueryProps<ITransactionBatch[]> = {}) => {
    return useQuery({
        queryKey: ['transaction-batch', 'end-approvals'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TransactionBatchService.getAllEndedBatchViewRequest()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                other.onError?.(errorMessage, error)
                throw errorMessage
            }

            return isArray(result) ? result : []
        },
        enabled,
        retry: 1,
        ...other,
        initialData: other.initialData ?? [],
    })
}

export const useTransBatchUpdateSignApproval = createMutationHook<
    ITransactionBatch,
    string,
    { id: TEntityId; data: ITransactionBatchSignatures }
>(
    ({ id, data }) =>
        TransactionBatchService.updateEndedBatchApprovals(id, data),
    'Approval & Signature Saved!'
)
