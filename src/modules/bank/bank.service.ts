import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IBank, IBankRequest } from '../bank'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IBank,
    IBankRequest
>({
    url: '/api/v1/bank',
    baseKey: 'bank',
})

// Add custom CRUD API service here if needed

export const {
    useCreate,
    useDeleteById,
    useDeleteMany,
    useGetAll,
    useGetById,
    useGetPaginated,
    useUpdateById,
} = apiCrudHooks

// Add custom API query hooks here if needed

export const BankAPI = apiCrudService
