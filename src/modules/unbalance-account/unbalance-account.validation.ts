import z from 'zod'

import { EntityIdSchema, entityIdSchema } from '@/validation'

export const UnbalanceAccountSchema = z.object({
    id: entityIdSchema.optional(),

    currency_id: EntityIdSchema('Currency is required'),
    currency: z.any().optional(),

    account_for_shortage_id: EntityIdSchema('Shortage Account is required'),
    account_for_shortage: z.any(),

    account_for_overage_id: EntityIdSchema('Overage Account is required'),
    account_for_overage: z.any(),

    member_profile_id_for_shortage: entityIdSchema.optional(),
    member_profile_for_shortage: z.any().optional(),

    member_profile_id_for_overage: entityIdSchema.optional(),
    member_profile_for_overage: z.any().optional(),

    name: z.string().optional(),
    description: z.string().optional(),
})

export type TUnbalanceAccountSchema = z.infer<typeof UnbalanceAccountSchema>
