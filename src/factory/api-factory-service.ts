import qs from 'query-string'

import APIService from '../api-service/api-service'

import { IPaginatedResult, TEntityId } from '@/types'

// Typical na CRUD service functions
export const createAPICrudService = <TData, TPayload>(baseEndpoint: string) => {
    return {
        async create(payload: TPayload) {
            const response = await APIService.post<TPayload, TData>(
                baseEndpoint,
                payload
            )
            return response.data
        },
        async updateById(id: TEntityId, payload: TPayload) {
            const response = await APIService.put<TPayload, TData>(
                `${baseEndpoint}/${id}`,
                payload
            )
            return response.data
        },
        async getById(id: TEntityId) {
            const response = await APIService.get<TData>(
                `${baseEndpoint}/${id}`
            )
            return response.data
        },
        async deleteById(id: TEntityId) {
            await APIService.delete(`${baseEndpoint}/${id}`)
        },
        async deleteMany(ids: TEntityId[]) {
            await APIService.delete(`${baseEndpoint}/bulk-delete`, { ids })
        },
    }
}

// Use this if ur service ay may all at pagintion/search/sorted shit
export const createAPICollectionService = <
    TData,
    TPaginatedResult = IPaginatedResult<TData>,
>(
    baseEndpoint: string
) => {
    return {
        async allList() {
            const response = await APIService.get<TData[]>(`${baseEndpoint}/`)
            return response.data
        },
        async search({
            sort,
            filters,
            pagination,
        }: {
            sort?: string
            filters?: string
            pagination?: { pageIndex: number; pageSize: number }
        } = {}) {
            const url = qs.stringifyUrl(
                {
                    url: `/${baseEndpoint}/search`,
                    query: {
                        sort,
                        filter: filters,
                        pageSize: pagination?.pageSize,
                        pageIndex: pagination?.pageIndex,
                    },
                },
                { skipNull: true }
            )

            const response = await APIService.get<TPaginatedResult>(url)
            return response.data
        },
    }
}
