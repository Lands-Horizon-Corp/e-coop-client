import { useQuery } from '@tanstack/react-query'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import {
    ICheckWarehousing,
    ICheckWarehousingRequest,
    ICheckWarehousingSummary,
} from './check-warehousing.types'

const { baseQueryKey, apiCrudHooks, apiCrudService } = createDataLayerFactory<
    ICheckWarehousing,
    ICheckWarehousingRequest
>({
    url: '/api/v1/check-warehousing',
    baseKey: 'check-warehousing',
})

export const checkWarehousingBaseQueryKey = baseQueryKey
export const { API, route: checkWarehousingAPIRoute } = apiCrudService

export const {
    useCreate: useCreateCheck,
    useGetById: useGetCheckById,
    useUpdateById: useUpdateCheckById,
    useDeleteById: useDeleteCheckById,
    useGetPaginated: useGetCheckPaginated,
} = apiCrudHooks

export const checkWarehousingService = {
    ...apiCrudService,
    getSummary: async (): Promise<ICheckWarehousingSummary> => {
        const response = await API.get<ICheckWarehousingSummary>(
            `${checkWarehousingAPIRoute}/summary`
        )
        return response.data
    },
}

export const useCheckWarehousingSummary = (
    options?: HookQueryOptions<ICheckWarehousingSummary, Error>
) => {
    return useQuery<ICheckWarehousingSummary, Error>({
        queryKey: [checkWarehousingBaseQueryKey, 'summary'],
        queryFn: () => checkWarehousingService.getSummary(),
        ...options,
    })
}

export const useGetAllChecks = (
    options?: HookQueryOptions<ICheckWarehousing[], Error>
) => {
    return useQuery<ICheckWarehousing[], Error>({
        queryKey: [checkWarehousingBaseQueryKey, 'all'],
        queryFn: () => checkWarehousingService.getAll(),
        ...options,
    })
}
