import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import { IDisbursement, IDisbursementRequest } from '@/types'

const CrudServices = createAPICrudService<IDisbursement, IDisbursementRequest>(
    '/api/v1/disbursement'
)
const CollectionServices = createAPICollectionService<IDisbursement>(
    '/api/v1/disbursement'
)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { search, allList } = CollectionServices

export default {
    ...CrudServices,
    ...CollectionServices,
}
