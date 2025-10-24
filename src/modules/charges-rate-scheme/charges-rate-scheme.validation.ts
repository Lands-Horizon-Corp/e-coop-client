import z from 'zod'

import {
    EntityIdSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

export const ChargesRateSchemeSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'ChargesRateScheme name is required'),
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),

    icon: z.string().optional(),

    currency_id: EntityIdSchema('Currency is required'),
})

export type TChargesRateSchemeSchema = z.infer<typeof ChargesRateSchemeSchema>
