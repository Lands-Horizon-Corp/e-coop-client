import APIService from './api-service'

import {
    TEntityId,
    IIntraBatchFunding,
    IIntraBatchFundingRequest,
} from '@/types'

export const createBatchFund = async (data: IIntraBatchFundingRequest) => {
    const response = await APIService.post<
        IIntraBatchFundingRequest,
        IIntraBatchFunding
    >('/batch-funding', data)
    return response.data
}

export const getTransactionBatchAllFund = async (id: TEntityId) => {
    const response = await APIService.get<IIntraBatchFunding[]>(
        `/batch-funding/transaction-batch/${id}`
    )
    return response.data
}
