import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const CheckWarehousingSchema = z.object({
    member_profile_id: entityIdSchema,
    bank_id: entityIdSchema,
    employee_user_id: entityIdSchema,

    media_id: entityIdSchema.optional().nullable(),

    check_number: z
        .string()
        .min(1, 'Check number is required')
        .max(255, 'Check number is too long'),

    check_date: z.coerce.date(),
    date: z.coerce.date(),

    clear_days: z.coerce.number().optional(),
    date_cleared: z.coerce.date(),

    amount: z.coerce.number().gt(0, 'Amount must be greater than 0'),

    reference_number: z
        .string()
        .max(255, 'Reference number is too long')
        .optional(),

    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),

    media: z.any(),
    member_profile: z.any(),
    bank: z.any(),
    employee_user: z.any(),
})

export type TCheckWarehousingSchema = z.infer<typeof CheckWarehousingSchema>
