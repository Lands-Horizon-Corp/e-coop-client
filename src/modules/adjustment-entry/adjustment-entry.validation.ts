import z from 'zod'

import { entityIdSchema } from '@/validation'

export const AdjustmentEntrySchema = z.object({
    signature_media_id: entityIdSchema,
    member_profile_id: entityIdSchema.optional(),
    employee_user_id: entityIdSchema.optional(),
    payment_type_id: entityIdSchema.optional(),
    type_of_payment_type: z.string().max(50).optional(),
    description: z.string().optional(),
    reference_number: z.string().optional(),
    entry_date: z.string().optional(),
    debit: z.number().min(0).optional(),
    credit: z.number().min(0).optional(),
})
