import { ICollateral, ICollateralRequest } from '@/types'

import {
    createAPICollectionService,
    createAPICrudService,
} from '../factory/api-factory-service'

const CrudServices = createAPICrudService<ICollateral, ICollateralRequest>(
    `collateral`
)
const CollectionServices = createAPICollectionService<ICollateral>(`collateral`)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
