import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const AdjustmentEntrySchema = z.object({
    signature_media_id: entityIdSchema.optional(),
    account_id: entityIdSchema,
    member_profile_id: entityIdSchema.optional(),
    employee_user_id: entityIdSchema.optional(),
    payment_type_id: entityIdSchema.optional(),

    type_of_payment_type: z.string().max(255).optional(),
    description: z
        .string()
        .max(255)
        .transform(descriptionTransformerSanitizer)
        .optional(),
    reference_number: z.string().max(255).optional(),
    entry_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    debit: z.number().min(0),
    credit: z.number().min(0),

    member_profile: z.any().optional(),
    employee_user: z.any().optional(),
    signature_media: z.any().optional(),
    account: z.any().optional(),
})

export type TAdjustmentEntrySchema = z.infer<typeof AdjustmentEntrySchema>
