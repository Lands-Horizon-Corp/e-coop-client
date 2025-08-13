import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validations/common'

export const memberAssetsSchema = z.object({
    id: entityIdSchema.optional(),
    entryDate: z.string().min(1, 'Entry Date is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
    name: z.string().min(1, 'Name is required'),
})
