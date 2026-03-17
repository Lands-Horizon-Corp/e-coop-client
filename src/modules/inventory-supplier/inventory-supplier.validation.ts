import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const InventorySupplierSchema = z.object({
    id: entityIdSchema.optional(),

    name: z.string().min(1, 'Supplier name is required'),

    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),

    address: z.string().optional(),

    contact_number: z.string().optional(),

    longitude: z.number().optional(),
    latitude: z.number().optional(),

    icon: z.string().optional(),

    media_id: entityIdSchema.optional(),
    media: z.any(),
})
export type TInventorySupplierSchema = z.infer<typeof InventorySupplierSchema>
