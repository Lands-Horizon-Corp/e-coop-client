import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import { IAccounTagRequest, IAccountTag } from './account-tag.types'

const { apiCrudHooks } = createDataLayerFactory<IAccountTag, IAccounTagRequest>(
    {
        url: 'api/v1/account-tag',
        baseKey: 'account-tag',
    }
)

export const {
    useCreate,
    useDeleteById,
    useUpdateById,
    useGetById,
    useGetAll,
    useDeleteMany,
    useGetPaginated,
} = apiCrudHooks

export const logger = Logger.getInstance('account-tag')
