import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type { IBatchFunding, IBatchFundingRequest } from './batch-funding.types'

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

export const useGetAllTransactionBatchBatchFunding = ({
    transactionBatchId,
    query,
    options,
}: {
    transactionBatchId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IBatchFunding[], Error>
}) => {
    return useQuery<IBatchFunding[], Error>({
        ...options,
        queryKey: [
            baseQueryKey,
            'all',
            'transaction-batch',
            transactionBatchId,
            query,
        ].filter(Boolean),
        queryFn: async () =>
            getAllBatchFundings({
                query,
                url: `${batchFundingAPIRoute}/transaction-batch/${transactionBatchId}`,
            }),
    })
}

export const logger = Logger.getInstance('batch-funding')
