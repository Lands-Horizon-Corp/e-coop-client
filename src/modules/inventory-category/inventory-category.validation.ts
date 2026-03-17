import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const InventoryCategorySchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'InventoryCategory name is required'),
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
    icon: z.string().min(1, 'Icon is Required'),
})

export type TInventoryCategorySchema = z.infer<typeof InventoryCategorySchema>
