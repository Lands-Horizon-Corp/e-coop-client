// services/account-tag-service.ts
import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import { IAccounTagRequest, IAccountTag } from '@/types'

const CrudServices = createAPICrudService<IAccountTag, IAccounTagRequest>(
    '/account-tag'
)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices

const CollectionServices =
    createAPICollectionService<IAccountTag>('/account-tag')

export const { search, allList } = CollectionServices

export default {
    ...CrudServices,
    ...CollectionServices,
}
