import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '@/validation'

export const MemberOccupationSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }).trim(),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
