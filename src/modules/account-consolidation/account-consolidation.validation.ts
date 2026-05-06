import z from 'zod'

import { entityIdSchema } from '@/validation'

export const AccountConsolidationSchema = z.object({
    primary_account_id: entityIdSchema.optional(),
    linked_account_id: entityIdSchema.optional(),
})

export type TAccountConsolidationSchema = z.infer<
    typeof AccountConsolidationSchema
>
