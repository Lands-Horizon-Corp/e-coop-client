import { IPaginatedResult } from '../coop-types'
import { IAuditable, ITimeStamps, TEntityId } from '../common'

export interface ISubscriptionPlan extends ITimeStamps, IAuditable {
    id: TEntityId
    name: string
    description: string

    cost: number
    timespan: number

    max_members: number
    max_branches: number
    max_employees: number

    discount: number
    yearly_discount: number
}

export interface ISubscriptionPlanRequest {
    id?: TEntityId

    name: string
    description: string

    cost: number
    timespan: number

    max_members: number
    max_branches: number
    max_employees: number

    discount: number
    yearly_discount: number
}

export interface ISubscriptionPlanPaginated
    extends IPaginatedResult<ISubscriptionPlan> {}
