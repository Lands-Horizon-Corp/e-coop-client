import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IMemberType, IMemberTypeRequest } from './member-type.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberType,
    IMemberTypeRequest
>({
    url: '/api/v1/member-type',
    baseKey: 'member-type',
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

export const MemberTypeAPI = apiCrudService

export const logger = Logger.getInstance('member-type')
