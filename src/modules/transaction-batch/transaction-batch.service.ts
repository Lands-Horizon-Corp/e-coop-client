import { useQuery } from '@tanstack/react-query'

import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import { HookQueryOptions } from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import { ICashCount, ICashCountBatchRequest } from '../cash-count'
import { cashCountAPIRoute } from '../cash-count/cash-count.service'
import type {
    ITransactionBatch,
    ITransactionBatchDepositInBankRequest,
    ITransactionBatchEndRequest,
    ITransactionBatchMinimal,
    ITransactionBatchPaginated,
    ITransactionBatchRequest,
    TTransactionBatchFullorMin,
} from './transaction-batch.types'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: transactionBatchQueryKey,
} = createDataLayerFactory<ITransactionBatch, ITransactionBatchRequest>({
    url: '/api/v1/transaction-batch',
    baseKey: 'transaction-batch',
})

// ⚙️🛠️ API SERVICE HERE

export const {
    API,
    route: transactionBatchAPIRoute,

    create: createTransactionBatch,
    updateById: updateTransactionBatchById,

    deleteById: deleteTransactionBatchById,
    deleteMany: deleteManyTransactionBatches,

    getById: getTransactionBatchById,
    getAll: getAllTransactionBatches,
    getPaginated: getPaginatedTransactionBatches,
} = apiCrudService

export const currentTransactionBatch = async () => {
    const response = await API.get<
        ITransactionBatchMinimal | ITransactionBatch
    >(`${apiCrudService.route}/current`)
    return response.data
}

export const allowBlotterView = async (
    id: TEntityId
): Promise<ITransactionBatch> => {
    const response = await API.put<void, ITransactionBatch>(
        `${apiCrudService.route}/${id}/view-accept`
    )
    return response.data
}

export const endCurrentBatch = async (data: ITransactionBatchEndRequest) => {
    const response = await API.put<
        ITransactionBatchEndRequest,
        TTransactionBatchFullorMin
    >(`${apiCrudService.route}/end`, data)
    return response.data
}

export const getCurrentBatchCashCounts = async () => {
    const response = await API.get<ICashCount[]>('/api/v1/cash-count')
    return response.data
}

export const requestTransactionBatchBlotterView = async (id: TEntityId) => {
    const response = await API.put<void, ITransactionBatchMinimal>(
        `${transactionBatchAPIRoute}/${id}/view-request`
    )
    return response.data
}

export const updateBatchCashCount = async (data: ICashCountBatchRequest) => {
    const response = await API.put<ICashCountBatchRequest, ICashCount[]>(
        cashCountAPIRoute,
        data
    )
    return response.data
}

export const setDepositInBank = async (
    id: TEntityId,
    payload: ITransactionBatchDepositInBankRequest
) => {
    const response = await API.put<
        ITransactionBatchDepositInBankRequest,
        ITransactionBatchMinimal | ITransactionBatch
    >(`${transactionBatchAPIRoute}/${id}/deposit-in-bank`, payload)
    return response.data
}

// 🪝 HOOK STARTS HERE
export { transactionBatchQueryKey }

export const {
    useCreate,
    useDeleteById,
    useDeleteMany,
    useGetAll,
    useGetById,
    useUpdateById,
} = apiCrudHooks

// get current transaction batch cash count
export const useCurrentBatchCashCounts = ({
    query,
    options,
}: {
    query?: TAPIQueryOptions
    options?: HookQueryOptions<ICashCount[], Error>
}) => {
    return useQuery<ICashCount[], Error>({
        ...options,
        queryKey: [transactionBatchQueryKey, 'cash-count', 'current', query],
        queryFn: async () => getCurrentBatchCashCounts(),
    })
}

// Custom hook for fetching the current transaction batch
export const useCurrentTransactionBatch = ({
    options,
}: {
    options?: HookQueryOptions<
        ITransactionBatchMinimal | ITransactionBatch,
        Error
    >
} = {}) => {
    return useQuery<ITransactionBatchMinimal | ITransactionBatch>({
        ...options,
        queryKey: [transactionBatchQueryKey, 'current'],
        queryFn: async () => await currentTransactionBatch(),
    })
}

// get transaction batch paginated
export type TTransactionBatchHookMode = 'all' | 'me' | 'employee'

export const useFilteredPaginatedTransactionBatch = ({
    mode = 'all', // Default mode
    userOrganizationId,
    query,
    options,
}: {
    mode?: TTransactionBatchHookMode
    userOrganizationId?: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<ITransactionBatchPaginated, Error>
}) => {
    return useQuery<ITransactionBatchPaginated, Error>({
        ...options,
        queryKey: [
            'transaction-batch',
            'paginated',
            mode,
            userOrganizationId,
            query,
        ],
        queryFn: async () => {
            let url: string = `search`

            if (mode === 'me') {
                url = 'me/search'
            } else if (mode === 'employee') {
                if (!userOrganizationId) {
                    throw new Error(
                        'userOrganizationId is required for employee mode'
                    )
                }
                url = `employee/${userOrganizationId}/search`
            }

            return await apiCrudService.getPaginated({
                url: `${apiCrudService.route}/${url}`,
                query,
            })
        },
    })
}

export const useTransactionBatchRequestBlotterView = createMutationFactory<
    ITransactionBatchMinimal,
    string,
    TEntityId
>({
    mutationFn: (id) => requestTransactionBatchBlotterView(id),
})

// approve a transactionbatch with request view pending
export const useTransactionBatchAcceptBlotterView = createMutationFactory<
    ITransactionBatch,
    Error,
    TEntityId
>({
    mutationFn: async (id) => await allowBlotterView(id),
    invalidationFn: (args) =>
        updateMutationInvalidationFn('transaction-batch', args),
})

// end current transaction batch
export const useTransactionBatchEndCurrentBatch = createMutationFactory<
    TTransactionBatchFullorMin,
    Error,
    ITransactionBatchEndRequest
>({
    mutationFn: (data) => endCurrentBatch(data),
    invalidationFn: (args) =>
        updateMutationInvalidationFn('transaction-batch', args),
})

// update batch cash count
export const useUpdateBatchCashCounts = createMutationFactory<
    ICashCount[],
    Error,
    ICashCountBatchRequest
>({
    mutationFn: (data) => updateBatchCashCount(data),
})

export const useTransactionBatchSetDepositInBank = createMutationFactory<
    ITransactionBatchMinimal | ITransactionBatch,
    Error,
    { id: TEntityId; payload: ITransactionBatchDepositInBankRequest }
>({
    mutationFn: ({ id, payload }) => setDepositInBank(id, payload),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [transactionBatchQueryKey, args.resultData.id],
        })
        args.queryClient.invalidateQueries({
            queryKey: [transactionBatchQueryKey, 'current'],
        })
    },
})
