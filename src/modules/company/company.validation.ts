import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

export const CompanySchema = z.object({
    name: z.string().min(1, 'Company name is required'),
    media_id: entityIdSchema.optional(),
    media: z.any(),
    description: descriptionSchema
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
})
