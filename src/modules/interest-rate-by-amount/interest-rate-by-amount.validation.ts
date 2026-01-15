import z from 'zod'

import { PercentageSchema, entityIdSchema } from '@/validation'

export const InterestRateByAmountSchema = z
    .object({
        id: entityIdSchema.optional(),

        from_amount: z.coerce
            .number('Invalid amount')
            .min(0, 'From amount must be at least 0')
            .refine((val) => !isNaN(val), {
                message: 'From amount is required',
            }),
        to_amount: z.coerce
            .number('Invalid amount')
            .min(0, 'To amount must be at least 0')
            .refine((val) => !isNaN(val), {
                message: 'To amount is required',
            }),
        interest_rate: PercentageSchema,
    })
    .superRefine((data, ctx) => {
        if (data.from_amount !== undefined && data.to_amount !== undefined) {
            if (data.from_amount > data.to_amount) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'From amount must not be greater than to amount',
                    path: ['from_amount'],
                })
                ctx.addIssue({
                    code: 'custom',
                    message: 'To amount must not be less than from amount',
                    path: ['to_amount'],
                })
            }
        }
    })

export type TInterestRateByAmountSchema = z.infer<
    typeof InterestRateByAmountSchema
>
