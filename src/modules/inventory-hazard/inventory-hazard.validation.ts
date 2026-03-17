import z from 'zod'

import { descriptionTransformerSanitizer } from '@/validation'

export const InventoryHazardSchema = z.object({
    name: z.string().min(1, 'InventoryHazard name is required'),
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),

    icon: z.string().min(1, 'Icon is Required'),
})

export type TInventoryHazardSchema = z.infer<typeof InventoryHazardSchema>
