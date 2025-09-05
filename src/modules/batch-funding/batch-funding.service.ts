import { useQuery } from '@tanstack/react-query'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IBatchFunding,
    IBatchFundingPaginated,
    IBatchFundingRequest,
} from './batch-funding.types'

const { apiCrudHooks, apiCrudService, baseQueryKey } = createDataLayerFactory<
    IBatchFunding,
    IBatchFundingRequest
>({
    url: '/api/v1/batch-funding',
    baseKey: 'batch-funding',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API: batchFundingAPI,
    route: batchFundingAPIRoute,

    create: createBatchFunding,
    updateById: updateBatchFundingById,

    deleteById: deleteBatchFundingById,
    deleteMany: deleteManyBatchFundings,

    getById: getBatchFundingById,
    getAll: getAllBatchFundings,
    getPaginated: getPaginatedBatchFundings,
} = apiCrudService

// 🪝 HOOK STARTS HERE
export { baseQueryKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateBatchFunding,
    useDeleteById: useDeleteBatchFundingById,
    useDeleteMany: useDeleteManyBatchFundings,
    useGetAll: useGetAllBatchFundings,
    useGetById: useGetBatchFundingById,
    useUpdateById: useUpdateBatchFundingById,
} = apiCrudHooks

export const useGetPaginatedBatchFunding = ({
    transactionBatchId,
    query,
    options,
}: {
    transactionBatchId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IBatchFundingPaginated, Error>
}) => {
    return useQuery<IBatchFundingPaginated, Error>({
        ...options,
        queryKey: [baseQueryKey, 'paginated', transactionBatchId, query],
        queryFn: async () => getPaginatedBatchFundings({ query }),
    })
}
