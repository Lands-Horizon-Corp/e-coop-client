import z from 'zod'

import { entityIdSchema } from '@/validation'

export const cashCheckVoucherTagSchema = z.object({
    cash_check_voucher_id: entityIdSchema,
    name: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
})

export type CashCheckVoucherTagFormValues = z.infer<
    typeof cashCheckVoucherTagSchema
>
