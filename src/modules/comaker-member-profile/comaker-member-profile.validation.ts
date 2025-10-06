import z from 'zod'

import { entityIdSchema } from '@/validation'

export const ComakerMemberProfileSchema = z.object({
    id: entityIdSchema.optional(),
    member_profile_id: entityIdSchema,
    member_profile: z.any().optional(),

    loan_transaction_id: entityIdSchema.optional(), // will be provided by server after save
    loan_transaction: z.any().optional(),

    description: z.string().optional(),
    amount: z.coerce.number().min(0, 'Amount must be a positive number'),
    months_count: z.coerce.number().int().default(0),
    year_count: z.coerce.number().default(0),
})

export type TComakerMemberProfileSchema = z.infer<
    typeof ComakerMemberProfileSchema
>
