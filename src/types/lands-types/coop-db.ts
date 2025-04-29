import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../coop-types'

export interface ICoop extends ITimeStamps, IAuditable {
    id: TEntityId
    name: string
    address: string
    dbName: string
    subscribedPlanId: TEntityId
    subscribedPlanStart: string
}

export interface ICoopRequest {
    id?: TEntityId
    name: string
    address: string
    subscribedPlanId: TEntityId
}

export interface ICoopPaginated extends IPaginatedResult<ICoop> {}
