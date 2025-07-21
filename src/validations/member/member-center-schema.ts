import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'

export const memberCenterSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
