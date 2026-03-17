import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const InventoryStockSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'InventoryStock name is required'),
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TInventoryStockSchema = z.infer<typeof InventoryStockSchema>
