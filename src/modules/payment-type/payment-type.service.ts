import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import { IPaymentType, IPaymentTypeRequest } from './payment-type.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IPaymentType,
    IPaymentTypeRequest
>({
    url: '/api/v1/payment-type',
    baseKey: 'payment-type',
})

export const {
    useGetById,
    useGetAll,
    useCreate,
    useUpdateById,
    useDeleteById,
    useDeleteMany,
    useGetPaginated,
} = apiCrudHooks

export const { deleteById, deleteMany } = apiCrudService

export const logger = Logger.getInstance('payment-type')
