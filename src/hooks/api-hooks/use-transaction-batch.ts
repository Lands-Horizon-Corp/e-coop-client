import { createMutationHook } from './api-hook-factory'
import * as TransactionBatchService from '@/api-service/transaction-batch-service'

import {
    TEntityId,
    ITransactionBatchMinimal,
    IIntraBatchFundingRequest,
} from '@/types'

export const useCreateTransactionBatch = createMutationHook<
    ITransactionBatchMinimal,
    string,
    Omit<IIntraBatchFundingRequest, 'transaction_batch_id'>
>((variables) => TransactionBatchService.createTransactionBatch(variables))

export const useTransactionBatchRequestBlotterView = createMutationHook<
    ITransactionBatchMinimal,
    string,
    TEntityId
>(
    (id) => TransactionBatchService.requestTransactionBatchBlotterView(id),
    'Requested batch view'
)
