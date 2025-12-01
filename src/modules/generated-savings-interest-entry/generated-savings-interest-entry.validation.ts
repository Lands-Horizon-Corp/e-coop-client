import z from 'zod'

import { entityIdSchema } from '@/validation'

export const GeneratedSavingsInterestEntrySchema = z
    .object({
        id: entityIdSchema.optional(),

        account_id: entityIdSchema,
        account: z.any(),

        member_profile_id: entityIdSchema,
        member_profile: z.any(),

        interest_amount: z
            .number()
            .min(0, 'Interest amount must be non-negative'),
        interest_tax: z.number(),
    })
    .superRefine((data, ctx) => {
        if (data.interest_amount < data.interest_tax) {
            ctx.addIssue({
                code: 'custom',
                message:
                    'Interest amount must be greater than or equal to interest tax',
                path: ['interest_amount'],
            })
        }
    })

export type TGeneratedSavingsInterestEntrySchema = z.infer<
    typeof GeneratedSavingsInterestEntrySchema
>
