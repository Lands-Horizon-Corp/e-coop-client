import { z } from 'zod'

import { IAuditable, ITimeStamps, entityIdSchema } from '@/types/common'

// ---------- Interfaces ----------
export interface IChargesRateByRangeOrMinimumAmountBase
    extends ITimeStamps,
        IAuditable {
    id: string
    organization_id: string
    branch_id: string
    charges_rate_scheme_id: string

    from: number
    to: number
    charge: number
    amount: number
    minimum_amount: number
}

export interface IChargesRateByRangeOrMinimumAmountRequest {
    id?: string
    organization_id: string
    branch_id: string
    charges_rate_scheme_id: string

    from: number
    to: number
    charge: number
    amount: number
    minimum_amount: number
}

// ---------- Zod Schemas ----------
export const ChargesRateByRangeOrMinimumAmountRequestSchema = z.object({
    id: entityIdSchema.optional(),
    organization_id: entityIdSchema,
    branch_id: entityIdSchema,
    charges_rate_scheme_id: entityIdSchema,
    from: z.number().nonnegative(),
    to: z.number().nonnegative(),
    charge: z.number().nonnegative(),
    amount: z.number().nonnegative(),
    minimum_amount: z.number().nonnegative(),
})

export type TChargesRateByRangeOrMinimumAmountRequest = z.infer<
    typeof ChargesRateByRangeOrMinimumAmountRequestSchema
>
