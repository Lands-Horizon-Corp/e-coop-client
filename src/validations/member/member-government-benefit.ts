import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
    mediaSchema,
} from '@/validations/common'

export const memberGovernmentBenefitSchema = z.object({
    id: entityIdSchema.optional(),
    country: z.string().min(1, 'Country is required'),
    name: z.string().min(1, 'Name is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
    value: z.string().min(1, 'Value is required'),
    frontMediaId: entityIdSchema.optional(),
    frontMediaResource: mediaSchema.optional(),
    backMediaResource: mediaSchema.optional(),
    backMediaId: entityIdSchema.optional(),
})
