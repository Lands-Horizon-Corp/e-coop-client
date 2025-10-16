import z from 'zod'

import { entityIdSchema } from '@/validation'

export const voucherPayToRequestSchema = z.object({
    name: z.string().optional(),
    media_id: entityIdSchema.optional(),
    description: z.string().optional(),
})

export type IVoucherPayToRequest = z.infer<typeof voucherPayToRequestSchema>
