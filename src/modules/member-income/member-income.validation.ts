import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

export const memberIncomeRequestSchema = z.object({
    media_id: entityIdSchema.optional(),
    name: z.string().min(1).max(255),
    amount: z.number(),
    release_date: z.string().datetime().optional(),
})

export const memberIncomeSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    amount: z.coerce.number().min(0, 'Amount must be non-negative'),
    date: z.string().min(1, 'Date is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
