import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validations/common'

export const memberExpenseSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    date: z.string().min(1, 'Date is required'),
    amount: z.coerce.number().min(0, 'Amount must be non-negative'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
