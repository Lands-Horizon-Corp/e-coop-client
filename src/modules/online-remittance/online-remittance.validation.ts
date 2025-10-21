import z from 'zod'

import {
    descriptionTransformerSanitizer,
    entityIdSchema,
    stringDateWithTransformSchema,
} from '@/validation'

export const OnlineRemittanceSchema = z.object({
    id: entityIdSchema.optional(),

    bank_id: entityIdSchema,
    media_id: entityIdSchema.optional(),
    media: z.any().optional(), // Pang view lang

    transaction_batch_id: entityIdSchema.optional(),

    employee_user_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),

    reference_number: z.string().min(1, 'Reference Number is required'),
    account_name: z.string().min(1, 'Account Name is required'),

    amount: z.coerce.number().min(1, 'Minimum amount is 1'),

    date_entry: stringDateWithTransformSchema,

    currency_id: entityIdSchema,
    currency: z.any().optional(),

    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TOnlineRemittanceSchema = z.infer<typeof OnlineRemittanceSchema>
