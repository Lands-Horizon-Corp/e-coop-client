import z from 'zod'

import { entityIdSchema } from '@/validation'

export const checkRemittanceSchema = z.object({
    bank_id: entityIdSchema,
    media_id: entityIdSchema.optional().nullable(),
    employee_user_id: entityIdSchema.optional().nullable(),
    transaction_batch_id: entityIdSchema.optional().nullable(),
    country_code: z.string().optional(),
    reference_number: z.string().optional(),
    account_name: z.string().optional(),
    amount: z.number(),
    date_entry: z.string().optional().nullable(),
    description: z.string().optional(),
})
export type TCheckRemittanceFormValues = z.infer<typeof checkRemittanceSchema>
