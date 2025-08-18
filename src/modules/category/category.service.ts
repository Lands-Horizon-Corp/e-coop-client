import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { TCategory, TCategoryRequest } from '../category'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    TCategory,
    TCategoryRequest
>({
    url: '/api/v1/category',
    baseKey: 'category',
})

// Add mo custom crud api service here

export const {
    useCreate,
    useDeleteById,
    useDeleteMany,
    useGetAll,
    useGetById,
    useGetPaginated,
    useUpdateById,
} = apiCrudHooks

// Add mo custom api query hooks here

export const CategoryAPI = apiCrudService
