import { IPaginatedResult } from '@/types/common'
import { IAuditable, ITimeStamps, TEntityId } from '@/types/common'

export interface ISubscriptionPlan extends ITimeStamps, IAuditable {
    id: TEntityId
    name: string
    description: string

    cost: number
    monthly_price: number
    yearly_price: number
    discounted_monthly_price: number
    discounted_yearly_price: number

    timespan: number

    max_branches: number
    max_employees: number
    max_members_per_branch: number

    discount: number
    yearly_discount: number
}

export interface ISubscriptionPlanRequest {
    id?: TEntityId

    name: string
    description: string

    cost: number
    monthly_price: number
    yearly_price: number
    discounted_monthly_price: number
    discounted_yearly_price: number

    timespan: number

    max_branches: number
    max_employees: number
    max_members_per_branch: number

    discount: number
    yearly_discount: number
}

export interface ISubscriptionPlanPaginated
    extends IPaginatedResult<ISubscriptionPlan> {}
