import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const CheckWarehousingSchema = z.object({
    // IDs
    member_profile_id: entityIdSchema,
    bank_id: entityIdSchema,
    employee_user_id: entityIdSchema,
    media_id: entityIdSchema.optional().nullable(),
    check_number: z
        .string()
        .min(1, 'Check number is required')
        .max(255, 'Check number is too long'),
    check_date: z.string().min(1, 'Check date is required'),
    date: z.string().min(1, 'Warehousing date is required'),
    clear_days: z.number().min(0, 'Clear days cannot be negative').default(0),
    amount: z.number().gt(0, 'Amount must be greater than 0'),
    reference_number: z
        .string()
        .max(255, 'Reference number is too long')
        .optional()
        .nullable(),
    description: z
        .string()
        .optional()
        .nullable()
        .transform(descriptionTransformerSanitizer),
})

export type TCheckWarehousingSchema = z.infer<typeof CheckWarehousingSchema>
