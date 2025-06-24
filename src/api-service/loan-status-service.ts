import {
    createAPICrudService,
    createAPICollectionService,
} from '../factory/api-factory-service'

const CrudServices = createAPICrudService('/loan-status')
const CollectionServices = createAPICollectionService('/loan-status')

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
