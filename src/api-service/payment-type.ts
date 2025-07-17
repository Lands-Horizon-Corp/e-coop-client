import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import { IPaymentType, IPaymentTypeRequest } from '@/types'

const CrudServices = createAPICrudService<IPaymentType, IPaymentTypeRequest>(
    '/payment-type'
)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices

const CollectionServices =
    createAPICollectionService<IPaymentType>('/payment-type')

export const { search, allList } = CollectionServices

export default {
    ...CrudServices,
    ...CollectionServices,
}
