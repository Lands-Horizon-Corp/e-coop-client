import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import { IPermissionTemplate, IPermissionTemplateRequest } from '@/types'

const CrudService = createAPICrudService<
    IPermissionTemplate,
    IPermissionTemplateRequest
>('permission-template')

const CollectionService = createAPICollectionService<IPermissionTemplate>(
    '/api/v1/permission-template'
)

export const { create, deleteById, getById, updateById, deleteMany } =
    CrudService
export const { allList, search } = CollectionService

export default { ...CrudService, ...CollectionService }
