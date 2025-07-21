import z from 'zod'

import { descriptionSchema, descriptionTransformerSanitizer } from '../common'

export const memberClassificationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
