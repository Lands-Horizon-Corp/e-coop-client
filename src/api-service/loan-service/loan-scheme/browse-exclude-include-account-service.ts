import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import {
    IBrowseExcludeIncludeAccounts,
    IBrowseExcludeIncludeAccountsRequest,
} from '@/types'

const CrudServices = createAPICrudService<
    IBrowseExcludeIncludeAccounts,
    IBrowseExcludeIncludeAccountsRequest
>('/browse-exclude-include-accounts')
const CollectionServices =
    createAPICollectionService<IBrowseExcludeIncludeAccounts>(
        '/browse-exclude-include-accounts'
    )

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
