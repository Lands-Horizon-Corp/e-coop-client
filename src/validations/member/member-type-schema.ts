import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'

export const createMemberTypeSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    prefix: z.string().min(1, 'Prefix is required').max(3, 'Max 3 characters'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
