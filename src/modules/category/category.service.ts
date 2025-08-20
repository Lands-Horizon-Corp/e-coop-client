import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { ICategory } from '../category'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    ICategory,
    void
>({
    url: '/api/v1/category',
    baseKey: 'category',
})

// Add mo custom crud api service here

export const { useDeleteById, useGetAll, useGetById, useGetPaginated } =
    apiCrudHooks

// Add mo custom api query hooks here

export const CategoryAPI = apiCrudService
