import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { TCategory, TCategoryRequest } from '../category'

const CategoryDataLayer = createDataLayerFactory<TCategory, TCategoryRequest>({
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
} = CategoryDataLayer.apiCrudHooks

// Add mo custom api query hooks here

export const CategoryAPI = { ...CategoryDataLayer.apiCrudService }
