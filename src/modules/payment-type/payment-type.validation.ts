import z from 'zod'

import { descriptionTransformerSanitizer } from '@/validation'

export const PaymentTypeSchema = z.object({
    name: z.string().min(1, 'Payment type name is required'),
    description: z
        .string()
        .max(100, 'Description must contain at most 50 character(s)')
        .optional()
        .transform(descriptionTransformerSanitizer),
    number_of_days: z
        .number()
        .int()
        .min(0, 'Number of days must be non-negative')
        .optional(),
    type: z.enum(['cash', 'check', 'online'], 'Payment type is required'),
})

export type PaymentTypeFormValues = z.infer<typeof PaymentTypeSchema>
