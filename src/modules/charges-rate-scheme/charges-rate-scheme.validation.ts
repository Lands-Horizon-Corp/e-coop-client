import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const ChargesRateSchemeSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'ChargesRateScheme name is required'),
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TChargesRateSchemeSchema = z.infer<typeof ChargesRateSchemeSchema>
