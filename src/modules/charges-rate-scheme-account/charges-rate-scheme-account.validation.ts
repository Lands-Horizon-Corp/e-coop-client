import z from 'zod'

import { entityIdSchema } from '@/validation'

export const chargesRateSchemeAccountSchema = z.object({
    charges_rate_scheme_id: entityIdSchema.min(
        1,
        'Charges Rate Scheme ID is required'
    ),
    account_id: entityIdSchema.min(1, 'Account ID is required'),
})
export type ChargesRateSchemeAccountFormValues = z.infer<
    typeof chargesRateSchemeAccountSchema
>
