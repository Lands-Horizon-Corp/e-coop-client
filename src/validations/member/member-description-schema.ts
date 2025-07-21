import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validations/common'

export const memberDescriptionSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
