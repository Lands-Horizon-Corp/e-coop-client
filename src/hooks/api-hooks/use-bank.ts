import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import BankService from '@/api-service/bank-service'

import {
    IAPIHook,
    IQueryProps,
    IOperationCallbacks,
    IAPIFilteredPaginatedHook,
} from './types'
import {
    IBankPaginatedResource,
    IBankRequest,
    IBankResponse,
} from '@/types/coop-types/bank'
import { TEntityId } from '@/types'

export const useCreateBank = ({
    showMessage = true,
    onError,
    onSuccess,
}: IAPIHook<IBankResponse, string> & IQueryProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<IBankResponse, string, IBankRequest>({
        mutationKey: ['bank', 'create'],
        mutationFn: async (data) => {
            const [error, newBank] = await withCatchAsync(
                BankService.create(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['bank', 'resource-query'],
            })
            queryClient.invalidateQueries({ queryKey: ['bank', newBank.id] })
            queryClient.removeQueries({
                queryKey: ['bank', 'loader', newBank.id],
            })

            if (showMessage) toast.success('New Bank Created')
            onSuccess?.(newBank)

            return newBank
        },
    })
}

export const useUpdateBank = ({
    onError,
    onSuccess,
}: IOperationCallbacks<IBankResponse, string> = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IBankResponse,
        string,
        { bankId: TEntityId; data: IBankRequest }
    >({
        mutationKey: ['bank', 'update'],
        mutationFn: async ({ bankId, data }) => {
            const [error, result] = await withCatchAsync(
                BankService.update(bankId, data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['bank', 'resource-query'],
            })
            queryClient.invalidateQueries({ queryKey: ['bank', bankId] })
            queryClient.removeQueries({ queryKey: ['bank', 'loader', bankId] })

            toast.success('Bank updated')
            onSuccess?.(result)

            return result
        },
    })
}

export const useDeleteBank = ({
    onError,
    onSuccess,
}: IOperationCallbacks = {}) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['bank', 'delete'],
        mutationFn: async (bankId) => {
            const [error] = await withCatchAsync(BankService.delete(bankId))

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['bank', 'resource-query'],
            })
            queryClient.invalidateQueries({ queryKey: ['bank', bankId] })
            queryClient.removeQueries({ queryKey: ['bank', 'loader', bankId] })

            toast.success('Bank deleted')
            onSuccess?.(undefined)
        },
    })
}

export const useFilteredPaginatedBanks = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IBankPaginatedResource, string> &
    IQueryProps = {}) => {
    return useQuery<IBankPaginatedResource, string>({
        queryKey: ['bank', 'resource-query', filterPayload, pagination, sort],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                BankService.getBanks({
                    preloads,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}
