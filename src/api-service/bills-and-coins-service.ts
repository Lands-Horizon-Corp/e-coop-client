import { IBillsAndCoin, IBillsAndCoinRequest } from '@/types'

import {
    createAPICollectionService,
    createAPICrudService,
} from '../factory/api-factory-service'

const CrudServices = createAPICrudService<IBillsAndCoin, IBillsAndCoinRequest>(
    `bills-and-coins`
)
const CollectionServices =
    createAPICollectionService<IBillsAndCoin>(`bills-and-coins`)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
