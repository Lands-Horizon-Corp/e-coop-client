import { createMutationHook } from './api-hook-factory'
import * as BatchFundingService from '@/api-service/batch-funding-service'

import { IIntraBatchFunding, IIntraBatchFundingRequest } from '@/types'

export const useCreateBatchFunding = createMutationHook<
    IIntraBatchFunding,
    string,
    IIntraBatchFundingRequest
>((vars) => BatchFundingService.createBatchFund(vars), 'Added to batch fund')
