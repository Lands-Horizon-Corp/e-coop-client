import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
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
