import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const InventoryBrandSchema = z.object({
    id: entityIdSchema.optional(),

    name: z.string().min(1, 'Brand name is required'),

    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),

    icon: z.string().optional(),

    media_id: entityIdSchema.optional(),
    media: z.any(),
})

export type TInventoryBrandSchema = z.infer<typeof InventoryBrandSchema>
