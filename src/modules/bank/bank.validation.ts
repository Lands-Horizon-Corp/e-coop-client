import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

export const BankSchema = z.object({
    name: z.string().min(1, 'Bank name is required'),
    media_id: entityIdSchema.optional(),
    media: z.any(),
    description: descriptionSchema
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
})
