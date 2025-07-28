import { ISubscriptionPlan, ISubscriptionPlanRequest } from '@/types'

import {
    createAPICollectionService,
    createAPICrudService,
} from '../factory/api-factory-service'

const CrudServices = createAPICrudService<
    ISubscriptionPlan,
    ISubscriptionPlanRequest
>(`/subscription-plan`)
const CollectionServices =
    createAPICollectionService<ISubscriptionPlan>(`/subscription-plan`)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
