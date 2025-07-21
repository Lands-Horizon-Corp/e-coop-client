import { z } from 'zod'

import { descriptionSchema, descriptionTransformerSanitizer } from '../common'

export const createGenderSchema = z.object({
    name: z.string().min(1, 'Gender name is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
