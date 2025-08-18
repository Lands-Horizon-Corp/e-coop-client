import {
    type MutationOptions,
    type QueryOptions,
    useMutation,
    useQuery,
} from '@tanstack/react-query'

import type { TEntityId } from '@/modules/common'
import type { TAPIQueryOptions } from '@/types/api'

import { createAPIRepository } from './api-crud-factory'

export interface IPaginatedResponse<TData> {
    data: TData[]
    pageIndex: number
    totalPage: number
    pageSize: number
    totalSize: number
}

type HookQueryOptions<TQueryFnData, TError, TData = TQueryFnData> = Omit<
    QueryOptions<TQueryFnData, TError, TData>,
    'queryKey' | 'queryFn'
>

type HookMutationOptions<TQueryFnData, TError, TData = TQueryFnData> = Omit<
    MutationOptions<TQueryFnData, TError, TData>,
    'mutationFn'
>

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

    const useGetPaginated = <TData = TRequest, TError = Error>({
        query,
        options,
    }: {
        query?: TAPIQueryOptions
        options?: HookQueryOptions<IPaginatedResponse<TData>, TError>
    }) => {
        return useQuery<IPaginatedResponse<TData>, TError>({
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
        return useMutation<
            TResponse,
            Error,
            { id: TEntityId; payload: TRequest }
        >({
            ...options,
            mutationFn: (payload) => baseAPI.updateById(payload),
        })
    }

    const useDeleteById = ({
        options,
    }: {
        options?: HookMutationOptions<void, Error, TEntityId>
    } = {}) => {
        return useMutation<void, Error, TEntityId>({
            ...options,
            mutationFn: (payload) => baseAPI.deleteById({ id: payload }),
        })
    }

    const useDeleteMany = ({
        options,
    }: {
        options?: HookMutationOptions<void, Error, { ids: TEntityId[] }>
    } = {}) => {
        return useMutation<void, Error, { ids: TEntityId[] }>({
            ...options,
            mutationFn: (payload) => baseAPI.deleteMany(payload),
        })
    }

    return {
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
