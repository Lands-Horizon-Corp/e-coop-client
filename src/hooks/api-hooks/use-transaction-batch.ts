import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { isArray, serverRequestErrExtractor } from '@/helpers'
import { createMutationHook } from './api-hook-factory'
import * as TransactionBatchService from '@/api-service/transaction-batch-service'

import {
    IAPIHook,
    TEntityId,
    IQueryProps,
    ITransactionBatch,
    IBatchFundingRequest,
    ITransactionBatchMinimal,
    TTransactionBatchFullorMin,
    ITransactionBatchEndRequest,
    ITransactionBatchSignatures,
    ITransactionBatchDepositInBankRequest,
} from '@/types'

export const useCurrentTransactionBatch = ({
    enabled,
    showMessage = true,
}: IAPIHook<TTransactionBatchFullorMin, string> & IQueryProps = {}) => {
    return useQuery<TTransactionBatchFullorMin, string>({
        queryKey: ['transaction-batch', 'current'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TransactionBatchService.currentTransactionBatch()
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

export const useTransactionBatch = ({
    id,
    enabled,
    showMessage = true,
}: IAPIHook<ITransactionBatch, string> & IQueryProps & { id: TEntityId }) => {
    return useQuery<ITransactionBatch, string>({
        queryKey: ['transaction-batch', id],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TransactionBatchService.getTransactionBatchById(id)
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
    Omit<IBatchFundingRequest, 'transaction_batch_id'>
>((variables) => TransactionBatchService.createTransactionBatch(variables))

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
>((id) => TransactionBatchService.allowBlotterView(id), 'Batch view allowed')

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
