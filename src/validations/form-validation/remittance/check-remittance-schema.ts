import z from 'zod'
import {
    entityIdSchema,
    stringDateWithTransformSchema,
} from '@/validations/common'

export const checkRemittanceSchema = z.object({
    bank_id: entityIdSchema,
    media_id: entityIdSchema.optional(),
    media: z.any(), // pang view lamang

    transaction_batch_id: entityIdSchema.optional(),

    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),
    employee_user_id: entityIdSchema.optional(),

    country_code: z.string().min(1, 'Country Code is required'),
    reference_number: z.string().min(1, 'Reference Number is required'),
    account_name: z.string().min(1, 'Account Name is required'),
    amount: z.coerce.number().min(1, 'Minimum amount is 1'),
    date_entry: stringDateWithTransformSchema,
    description: z.string().optional(),
})
