import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'
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
        '/api/v1/cash-count',
        data
    )
    return response.data
}

const CrudServices = createAPICrudService<ICashCount, void>(
    '/api/v1/cash-count'
)
const CollectionServices =
    createAPICollectionService<ICashCount>('/api/v1/cash-count')

export const { getById } = CrudServices
export const { search } = CollectionServices

export default {
    getCurrentBatchCashCounts,
    updateBatchCashCount,
    getById,
    search,
}
