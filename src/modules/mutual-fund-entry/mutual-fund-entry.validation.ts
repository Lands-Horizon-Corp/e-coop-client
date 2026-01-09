import z from 'zod'

import { EntityIdSchema, entityIdSchema } from '@/validation'

export const MutualFundEntrySchema = z.object({
    id: entityIdSchema.optional(),

    member_profile_id: EntityIdSchema('Member Profile is required'),
    member_profile: z.any(),

    account_id: EntityIdSchema('Account is required'),
    account: z.any(),

    amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
})

export type TMutualFundEntrySchema = z.infer<typeof MutualFundEntrySchema>
