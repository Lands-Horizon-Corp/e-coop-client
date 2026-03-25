import z from 'zod'

import { entityIdSchema } from '@/validation'

export const InventoryUnifiedSchema = z
    .object({
        inventory_item_id: entityIdSchema.optional(),
        barcode: z.string().optional(),

        name: z.string().optional(),
        unit: z.string().optional(),

        category_id: entityIdSchema,
        brand_id: entityIdSchema,

        warehouse_id: entityIdSchema,
        supplier_id: entityIdSchema,

        quantity: z.coerce.number().min(1, 'Quantity is required'),
        unit_cost: z.coerce.number().optional(),

        description: z.string().optional(),

        status_in: z.string().optional(),
        status_out: z.string().optional(),

        category: z.any(),
        warehouse: z.any(),
        supplier: z.any(),
        brand: z.any(),
    })
    .refine((data) => data.status_in || data.status_out, {
        message: 'Either status_in or status_out is required',
        path: ['status_in'],
    })

export type TInventoryUnifiedFormValues = z.infer<typeof InventoryUnifiedSchema>
