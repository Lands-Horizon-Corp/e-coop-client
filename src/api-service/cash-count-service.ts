import {
    ICashCount,
    ICashCountBatchRequest,
} from '@/types/coop-types/cash-count'

import APIService from './api-service'

export const getCurrentBatchCashCounts = async () => {
    const response = await APIService.get<ICashCount[]>('/cash-count')
    return response.data
}

export const updateBatchCashCount = async (data: ICashCountBatchRequest) => {
    const response = await APIService.put<ICashCountBatchRequest, ICashCount[]>(
        '/cash-count',
        data
    )
    return response.data
}
