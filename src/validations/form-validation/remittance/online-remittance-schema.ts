import { z } from 'zod'
import { entityIdSchema } from '@/validations/common'

export const onlineRemittanceSchema = z.object({
    id: entityIdSchema.optional(),

    bank_id: entityIdSchema,
    media_id: entityIdSchema.optional(),
    media: z.any().optional(), // Pang view lang

    transaction_batch_id: entityIdSchema.optional(),

    employee_user_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),

    country_code: z.string().min(1, 'Country Code is required'),
    reference_number: z.string().min(1, 'Reference Number is required'),
    account_name: z.string().min(1, 'Account Name is required'),

    amount: z.coerce.number().min(1, 'Minimum amount is 1'),

    date_entry: z.coerce.string(),

    description: z.string().optional(),
})
