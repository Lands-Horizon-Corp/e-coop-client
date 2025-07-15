import { ITagTemplate, ITagTemplateRequest } from '@/types'

import {
    createAPICollectionService,
    createAPICrudService,
} from '../factory/api-factory-service'

const CrudServices = createAPICrudService<ITagTemplate, ITagTemplateRequest>(
    `tag-template`
)
const CollectionServices =
    createAPICollectionService<ITagTemplate>(`tag-template`)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
