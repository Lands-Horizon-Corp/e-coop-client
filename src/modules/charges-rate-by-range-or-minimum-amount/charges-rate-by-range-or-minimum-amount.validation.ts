import z from 'zod'

import { entityIdSchema } from '@/validation'

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
