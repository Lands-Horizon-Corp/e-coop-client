// services/account-tag-service.ts
import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import { IAccounTagRequest, IAccountTag } from '@/types'

const CrudServices = createAPICrudService<IAccountTag, IAccounTagRequest>(
    '/api/v1/account-tag'
)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices

const CollectionServices = createAPICollectionService<IAccountTag>(
    '/api/v1/account-tag'
)

export const { search, allList } = CollectionServices

export default {
    ...CrudServices,
    ...CollectionServices,
}
