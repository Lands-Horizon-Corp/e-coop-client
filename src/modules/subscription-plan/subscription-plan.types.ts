import { IPaginatedResult } from '@/types/common'
import { IAuditable, ITimeStamps, TEntityId } from '@/types/common'

import { ICurrency } from '../currency'

export type TPricingPlanMode = 'monthly' | 'yearly'

export interface ISubscriptionPlan extends ITimeStamps, IAuditable {
    id: TEntityId
    name: string
    description: string

    cost: number
    timespan: number

    max_branches: number
    max_employees: number
    max_members_per_branch: number

    discount: number
    yearly_discount: number
    is_recommended: boolean

    // Core Features
    has_api_access: boolean
    has_flexible_org_structures: boolean
    has_ai_enabled: boolean
    has_machine_learning: boolean

    // Limits
    max_api_calls_per_month: number

    // Calculated prices from backend
    monthly_price: number
    yearly_price: number
    discounted_monthly_price: number
    discounted_yearly_price: number

    currency_id: TEntityId
    currency: ICurrency
}

export interface ISubscriptionPlanRequest {
    id?: TEntityId

    name: string
    description: string

    cost: number
    timespan: number

    max_branches: number
    max_employees: number
    max_members_per_branch: number

    discount: number
    yearly_discount: number
    is_recommended?: boolean

    // Core Features
    has_api_access?: boolean
    has_flexible_org_structures?: boolean
    has_ai_enabled?: boolean
    has_machine_learning?: boolean

    // Limits
    max_api_calls_per_month?: number

    currency_id?: TEntityId | null
}

export interface ISubscriptionPlanPaginated
    extends IPaginatedResult<ISubscriptionPlan> {}

export type TSubscriptionPlanMode = 'all' | 'timezone'
