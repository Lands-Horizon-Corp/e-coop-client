import {
    type MutationOptions,
    type QueryObserverOptions,
    useMutation,
    useQuery,
} from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'

import type { TAPIQueryOptions } from '@/types/api'
import type { IPaginatedResult, TEntityId } from '@/types/common'

import { createAPIRepository } from './api-crud-factory'

export type HookQueryOptions<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
> = Omit<
    QueryObserverOptions<TQueryFnData, TError, TData>,
    'queryKey' | 'queryFn'
>

export type HookMutationOptions<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
> = Omit<MutationOptions<TQueryFnData, TError, TData>, 'mutationFn'>

// Create and Returns api base crud service and the query hook version of it
export const createDataLayerFactory = <TResponse, TRequest>({
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

    const useCreate = ({
        options,
    }: {
        options?: HookMutationOptions<TResponse, Error, TRequest>
    } = {}) => {
        return useMutation<TResponse, Error, TRequest>({
            ...options,
            meta: options?.meta
                ? options.meta
                : {
                      invalidates: [
                          [baseKey, 'paginated'],
                          [baseKey, 'all'],
                      ],
                  },
            mutationFn: (payload) => baseAPI.create({ payload }),
        })
    }

    const useUpdateById = ({
        options,
    }: {
        options?: HookMutationOptions<
            TResponse,
            Error,
            { id: TEntityId; payload: TRequest }
        >
    } = {}) => {
        const queryClient = useQueryClient()

        return useMutation<
            TResponse,
            Error,
            { id: TEntityId; payload: TRequest }
        >({
            ...options,
            meta: options?.meta
                ? options.meta
                : {
                      invalidates: [
                          [baseKey, 'paginated'],
                          [baseKey, 'all'],
                      ],
                  },
            mutationFn: (payload) => baseAPI.updateById(payload),
            onSuccess: async (data, variables, context) => {
                await Promise.all([
                    queryClient.invalidateQueries({
                        queryKey: [baseKey, variables.id],
                    }),
                ])
                options?.onSuccess?.(data, variables, context)
            },
        })
    }

    const useDeleteById = ({
        options,
    }: {
        options?: HookMutationOptions<void, Error, TEntityId>
    } = {}) => {
        const queryClient = useQueryClient()

        return useMutation<void, Error, TEntityId>({
            ...options,
            meta: options?.meta
                ? options.meta
                : {
                      invalidates: [
                          [baseKey, 'paginated'],
                          [baseKey, 'all'],
                      ],
                  },
            mutationFn: (payload) => baseAPI.deleteById({ id: payload }),
            onSuccess: async (data, variables, context) => {
                await Promise.all([
                    queryClient.invalidateQueries({
                        queryKey: [baseKey, variables],
                    }),
                ])
                options?.onSuccess?.(data, variables, context)
            },
        })
    }

    const useDeleteMany = ({
        options,
    }: {
        options?: HookMutationOptions<void, Error, { ids: TEntityId[] }>
    } = {}) => {
        return useMutation<void, Error, { ids: TEntityId[] }>({
            ...options,
            meta: options?.meta
                ? options.meta
                : {
                      invalidates: [
                          [baseKey, 'paginated'],
                          [baseKey, 'all'],
                      ],
                  },
            mutationFn: (payload) => baseAPI.deleteMany(payload),
        })
    }

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
