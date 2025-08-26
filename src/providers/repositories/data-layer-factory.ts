import { type QueryObserverOptions, useQuery } from '@tanstack/react-query'

import type { TAPIQueryOptions } from '@/types/api'
import type { IPaginatedResult, TEntityId } from '@/types/common'

import { createAPIRepository } from './api-crud-factory'
import {
    createMutationFactory,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from './mutation-factory'

export type HookQueryOptions<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
> = Omit<
    QueryObserverOptions<TQueryFnData, TError, TData>,
    'queryKey' | 'queryFn'
>

// Create and Returns api base crud service and the query hook version of it
export const createDataLayerFactory = <
    TResponse extends { id: TEntityId },
    TRequest,
>({
    url,
    baseKey,
}: {
    url: string
    baseKey: string
}) => {
    const baseAPI = createAPIRepository<TResponse, TRequest>(url)

    const useGetById = <TData = TResponse, TError = Error>({
        id,
        options,
    }: {
        id: TEntityId
        options?: HookQueryOptions<TData, TError>
    }) => {
        return useQuery<TData, TError>({
            ...options,
            queryKey: [baseKey, id],
            queryFn: async () => await baseAPI.getById<TData>({ id }),
        })
    }

    const useGetAll = <TData = TResponse, TError = Error>({
        query,
        options,
    }: {
        query?: TAPIQueryOptions
        options?: HookQueryOptions<TData[], TError>
    } = {}) => {
        return useQuery<TData[], TError>({
            ...options,
            queryKey: [baseKey, 'all', query],
            queryFn: async () => baseAPI.getAll(),
        })
    }

    const useGetPaginated = <TData = TResponse, TError = Error>({
        query,
        options,
    }: {
        query?: TAPIQueryOptions
        options?: HookQueryOptions<IPaginatedResult<TData>, TError>
    }) => {
        return useQuery<IPaginatedResult<TData>, TError>({
            ...options,
            queryKey: [baseKey, 'paginated', query],
            queryFn: async () => baseAPI.getPaginated({ query }),
        })
    }

    const useCreate = createMutationFactory<TResponse, Error, TRequest>({
        mutationFn: (payload) => baseAPI.create({ payload }),
        defaultInvalidates: [
            [baseKey, 'paginated'],
            [baseKey, 'all'],
        ],
    })

    const useUpdateById = createMutationFactory<
        TResponse,
        Error,
        { id: TEntityId; payload: TRequest }
    >({
        mutationFn: (variables) => baseAPI.updateById(variables),
        // defaultInvalidates: [ // experimentuhan ko pa to
        //     [baseKey, 'paginated'],
        //     [baseKey, 'all'],
        // ],
        invalidationFn: (args) => updateMutationInvalidationFn(baseKey, args),
    })

    const useDeleteById = createMutationFactory<void, Error, TEntityId>({
        mutationFn: (id) => baseAPI.deleteById({ id }),
        // defaultInvalidates: [ // experimentuhan ko pa to
        //     [baseKey, 'paginated'],
        //     [baseKey, 'all'],
        // ],
        invalidationFn: (args) => deleteMutationInvalidationFn(baseKey, args),
    })

    const useDeleteMany = createMutationFactory<
        void,
        Error,
        { ids: TEntityId[] }
    >({
        mutationFn: (payload) => baseAPI.deleteMany(payload),
        // defaultInvalidates: [ // experimentuhan ko pa to
        //     [baseKey, 'paginated'],
        //     [baseKey, 'all'],
        // ],
        invalidationFn: (args) => deleteMutationInvalidationFn(baseKey, args),
    })

    return {
        baseQueryKey: baseKey,

        // Query Hooks
        apiCrudHooks: {
            useGetById,
            useGetAll,
            useGetPaginated,

            // Mutation Hooks
            useCreate,
            useUpdateById,
            useDeleteById,
            useDeleteMany,
        },

        // Base/Typical na CRUD endpoint
        apiCrudService: baseAPI,
    }
}
