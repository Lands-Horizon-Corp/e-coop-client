import qs from 'query-string'

import { downloadFileService } from '@/helpers'

import { IPaginatedResult, TEntityId } from '@/types'

import APIService from '../api-service/api-service'

// Typical na CRUD service functions
export const createAPICrudService = <
    TData,
    TPayload,
    TUpData = TData,
    TUpPayload = TPayload,
    TGetData = TData,
    TDelData = void,
>(
    baseEndpoint: string
) => {
    return {
        async create(payload: TPayload) {
            const response = await APIService.post<TPayload, TData>(
                baseEndpoint,
                payload
            )
            return response.data
        },
        async updateById<TUpdateData = TUpData, TUpdatePayload = TUpPayload>(
            id: TEntityId,
            payload: TUpdatePayload
        ) {
            const response = await APIService.put<TUpdatePayload, TUpdateData>(
                `${baseEndpoint}/${id}`,
                payload
            )
            return response.data
        },
        async getById<TGetDataResponse = TGetData>(id: TEntityId) {
            const response = await APIService.get<TGetDataResponse>(
                `${baseEndpoint}/${id}`
            )
            return response.data
        },
        async deleteById<TDeleteData = TDelData>(id: TEntityId) {
            await APIService.delete<TDeleteData>(`${baseEndpoint}/${id}`)
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
        async allList({
            base = baseEndpoint,
            filter,
            sort,
        }: { base?: string; filter?: string; sort?: string } & {} = {}) {
            const url = qs.stringifyUrl({
                url: `${base}/`,
                query: {
                    filter,
                    sort,
                },
            })
            const response = await APIService.get<TData[]>(url)
            return response.data
        },
        async search({
            base = baseEndpoint,
            targetUrl = 'search',
            sort,
            filters,
            pagination,
        }: {
            base?: string
            targetUrl?: string
            sort?: string
            filters?: string
            pagination?: { pageIndex: number; pageSize: number }
        } = {}) {
            const url = qs.stringifyUrl(
                {
                    url: `${base}/${targetUrl}`,
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

// Use kung may export capability and shit
export const createAPIExportableService = (
    baseEndpoint: string,
    fileNames?: {
        base?: string
        allExport?: string
        filteredExport?: string
        selectedExport?: string
    }
) => {
    return {
        exportAll: async (): Promise<void> => {
            const url = `${baseEndpoint}/export`
            await downloadFileService(
                url,
                `all_${fileNames?.allExport ?? fileNames?.base ?? ''}_export.csv`
            )
        },

        exportFiltered: async (filters?: string): Promise<void> => {
            const url = qs.stringifyUrl(
                {
                    url: `${baseEndpoint}/export-search`,
                    query: { filters },
                },
                { skipNull: true }
            )
            await downloadFileService(
                url,
                `filtered_${fileNames?.filteredExport ?? fileNames?.base ?? ''}_export.csv`
            )
        },

        exportSelected: async (ids: TEntityId[]): Promise<void> => {
            if (ids.length === 0) {
                throw new Error(
                    'No member classification IDs provided for export.'
                )
            }

            const url = qs.stringifyUrl(
                {
                    url: `${baseEndpoint}/export-search`,
                    query: { ids },
                },
                { skipNull: true }
            )
            await downloadFileService(
                url,
                `selected_${fileNames?.filteredExport ?? fileNames?.base ?? ''}_export.csv`
            )
        },
    }
}
