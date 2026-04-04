import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

import { WAREHOUSE_TYPE } from './inventory-warehouse.types'

export const InventoryWarehouseSchema = z.object({
    id: entityIdSchema.optional(),

    name: z.string().min(1, 'Warehouse name is required'),

    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),

    type: z.enum(WAREHOUSE_TYPE).optional(),

    code: z.string().optional(),

    address: z.string().optional(),
    location: z.string().optional(),

    longitude: z.number().optional(),
    latitude: z.number().optional(),

    icon: z.string().optional(),

    media_id: entityIdSchema.optional(),
    media: z.any(),
})

export type TInventoryWarehouseSchema = z.infer<typeof InventoryWarehouseSchema>
