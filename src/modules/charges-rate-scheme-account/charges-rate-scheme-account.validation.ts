import z from 'zod'

import { entityIdSchema } from '@/validation'

export const chargesRateSchemeAccountSchema = z.object({
    id: entityIdSchema.optional(),
    account: z.any().optional(), // Pang display
    account_id: entityIdSchema.min(1, 'Account ID is required'),
})
export type ChargesRateSchemeAccountFormValues = z.infer<
    typeof chargesRateSchemeAccountSchema
>
