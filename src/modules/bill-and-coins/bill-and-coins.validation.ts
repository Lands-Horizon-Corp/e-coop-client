import z from 'zod'

import { EntityIdSchema, entityIdSchema } from '@/validation'

export const BillsAndCoinSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    value: z.coerce.number().min(0, 'Value is required'),
    media_id: entityIdSchema.optional(),

    currency_id: EntityIdSchema('Currency is required'),
    currency: z.any(),

    media: z.any(),
})

export type TBillsAndCoinSchema = z.infer<typeof BillsAndCoinSchema>
