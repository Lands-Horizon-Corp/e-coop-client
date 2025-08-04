import { ITagTemplate, ITagTemplateRequest } from '@/types'

import {
    createAPICollectionService,
    createAPICrudService,
} from '../factory/api-factory-service'

const CrudServices = createAPICrudService<ITagTemplate, ITagTemplateRequest>(
    `/api/v1/tag-template`
)
const CollectionServices =
    createAPICollectionService<ITagTemplate>(`/api/v1/tag-template`)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
