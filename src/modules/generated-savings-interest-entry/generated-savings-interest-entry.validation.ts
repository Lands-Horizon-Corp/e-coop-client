import z from 'zod'

import { EntityIdSchema, entityIdSchema } from '@/validation'

export const GeneratedSavingsInterestEntrySchema = z
    .object({
        id: entityIdSchema.optional(),

        account_id: entityIdSchema,
        account: z.any(),

        member_profile_id: entityIdSchema,
        member_profile: z.any(),

        generated_savings_interest_id: EntityIdSchema(
            'No Generated Savings Interest ID provided'
        ),

        interest_amount: z.coerce
            .number()
            .min(0, 'Interest amount must be non-negative'),
        interest_tax: z.coerce.number(),
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
