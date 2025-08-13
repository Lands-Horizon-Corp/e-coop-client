import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import {
    IIncludeNegativeAccount,
    IIncludeNegativeAccountRequest,
} from '@/types'

const CrudServices = createAPICrudService<
    IIncludeNegativeAccount,
    IIncludeNegativeAccountRequest
>('/api/v1/include-negative-accounts')
const CollectionServices = createAPICollectionService<IIncludeNegativeAccount>(
    '/api/v1/include-negative-accounts'
)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
