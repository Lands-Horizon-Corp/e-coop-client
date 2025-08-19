import z from 'zod'

import { IPaginatedResult, entityIdSchema } from '@/types/common'
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

export const SubscriptionPlanRequestSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1).max(255),
    description: z.string().min(1),
    cost: z.number().positive(),
    timespan: z.number().int().positive(),
    max_branches: z.number().int().nonnegative(),
    max_employees: z.number().int().nonnegative(),
    max_members_per_branch: z.number().int().nonnegative(),
    discount: z.number().nonnegative().optional().default(0),
    yearly_discount: z.number().nonnegative().optional().default(0),
    // organizations: z.array(OrganizationResponseSchema).optional(),
})
