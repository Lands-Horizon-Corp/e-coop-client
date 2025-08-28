import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    ICashCount,
    ICashCountBatchRequest,
    ICashCountRequest,
} from './cash-count.types'

const { apiCrudHooks, apiCrudService, baseQueryKey } = createDataLayerFactory<
    ICashCount,
    ICashCountRequest
>({
    url: '/api/v1/cash-count',
    baseKey: 'cash-count',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API,
    route: cashCountAPIRoute,

    create: createCashCount,
    updateById: updateCashCountById,

    deleteById: deleteCashCountById,
    deleteMany: deleteManyCashCounts,

    getById: getCashCountById,
    getAll: getAllCashCounts,
    getPaginated: getPaginatedCashCounts,
} = apiCrudService

export const getCurrentBatchCashCounts = async () => {
    const response = await API.get<ICashCount[]>(cashCountAPIRoute)
    return response.data
}

export const updateBatchCashCount = async (data: ICashCountBatchRequest) => {
    const response = await API.put<ICashCountBatchRequest, ICashCount[]>(
        cashCountAPIRoute,
        data
    )
    return response.data
}

// 🪝 HOOK STARTS HERE
export { baseQueryKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateCashCount,
    useDeleteById: useDeleteCashCountById,
    useDeleteMany: useDeleteManyCashCounts,
    useGetAll: useGetAllCashCounts,
    useGetById: useGetCashCountById,
    useGetPaginated: useGetPaginatedCashCounts,
    useUpdateById: useUpdateCashCountById,
} = apiCrudHooks
