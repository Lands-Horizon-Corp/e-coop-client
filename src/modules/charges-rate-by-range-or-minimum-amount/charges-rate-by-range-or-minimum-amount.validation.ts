import z from 'zod'

import { PercentageSchema, entityIdSchema } from '@/validation'

export const ChargesRateByRangeOrMinimumAmountSchema = z
    .object({
        id: entityIdSchema.optional(),

        charges_rate_scheme_id: entityIdSchema.optional(), // no need for this, this is handled in server
        from: z.coerce.number().min(0, 'From amount must be 0 or greater'),
        to: z.coerce.number().min(0, 'To amount must be 0 or greater'),
        charge: PercentageSchema.optional(),
        amount: z.coerce.number().min(0, 'Amount must be 0 or greater'),
        minimum_amount: z.coerce
            .number()
            .min(0, 'Minimum amount must be 0 or greater'),
    })
    .refine((data) => data.from >= data.to, {
        message: 'From amount cannot be greater than To amount',
        path: ['from'],
    })

export type TChargesRateByRangeOrMinimumAmountSchema = z.infer<
    typeof ChargesRateByRangeOrMinimumAmountSchema
>
