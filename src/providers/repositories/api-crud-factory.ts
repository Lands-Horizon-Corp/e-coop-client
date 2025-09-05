import qs from 'query-string'

import type { TAPIQueryOptions } from '@/types/api'
import type { IPaginatedResult, TEntityId } from '@/types/common'

import API from '../api'

export interface IAPIRepository<TResponse, TRequest> {
    route: string
    create: <TReq = TRequest, TDat = TResponse>(args: {
        payload: TReq
        url?: string
    }) => Promise<TDat>
    updateById: <TUpdateData = TResponse, TUpdatePayload = TRequest>(args: {
        id: TEntityId
        payload: TUpdatePayload
        url?: string
        targetUrl?: string
    }) => Promise<TUpdateData>
    getById: <TGetResponse = TResponse>(args: {
        id: TEntityId
        url?: string
    }) => Promise<TGetResponse>
    deleteById: <TDeleteData = undefined>(args: {
        id: TEntityId
        url?: string
    }) => Promise<TDeleteData>
    deleteMany: (args: { ids: TEntityId[]; url?: string }) => Promise<void>
    getAll: <TData = TResponse>(args?: {
        url?: string
        query?: TAPIQueryOptions
    }) => Promise<TData[]>
    getPaginated: <TData = TResponse>(args: {
        query?: TAPIQueryOptions
        url?: string
    }) => Promise<IPaginatedResult<TData>>
    API: typeof API
}

export const createAPIRepository = <TResponse, TRequest>(
    route: string
): IAPIRepository<TResponse, TRequest> => {
    const create = async <TDat = TResponse, TReq = TRequest>({
        payload,
        url,
    }: {
        payload: TReq
        url?: string
    }) => {
        const response = await API.post<TReq, TDat>(url || route, payload)
        return response.data
    }

    const updateById = async <
        TUpdateData = TResponse,
        TUpdatePayload = TRequest,
    >({
        id,
        payload,
        url,
        targetUrl = '',
    }: {
        id: TEntityId
        payload: TUpdatePayload
        url?: string
        targetUrl?: string
    }) => {
        const response = await API.put<TUpdatePayload, TUpdateData>(
            url || `${route}/${id}${targetUrl}`,
            payload
        )
        return response.data
    }

    const getById = async <TGetResponse = TResponse>({
        id,
        url,
    }: {
        id: TEntityId
        url?: string
    }) => {
        const response = await API.get<TGetResponse>(url || `${route}/${id}`)
        return response.data
    }

    const deleteById = async <TDeleteData = void>({
        id,
        url,
    }: {
        id: TEntityId
        url?: string
    }) => {
        const response = await API.delete<TDeleteData>(url || `${route}/${id}`)
        return response.data
    }

    const deleteMany = async ({
        ids,
        url,
    }: {
        ids: TEntityId[]
        url?: string
    }) => {
        await API.delete(url || `${route}/bulk-delete`, { ids })
    }

    const getAll = async <TData = TResponse>({
        url,
        query,
    }: {
        url?: string
        query?: TAPIQueryOptions
    } = {}) => {
        const newUrl = qs.stringifyUrl({ url: url || `${route}/`, query })
        const response = await API.get<TData[]>(newUrl)
        return response.data
    }

    const getPaginated = async <TData = TResponse>({
        query,
        url,
    }: {
        query?: TAPIQueryOptions
        url?: string
    }) => {
        const newUrl = qs.stringifyUrl(
            {
                url: url || `${route}/search`,
                query,
            },
            { skipNull: true }
        )

        const response = await API.get<IPaginatedResult<TData>>(newUrl)
        return response.data
    }

    return {
        API,
        route,
        create,
        updateById,
        getById,
        deleteById,
        deleteMany,
        getAll,
        getPaginated,
    }
}
