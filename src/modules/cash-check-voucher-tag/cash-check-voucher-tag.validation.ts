import z from 'zod'

import { ICONS } from '@/constants'
import {
    EntityIdSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

export const CashCheckVoucherTagSchema = z.object({
    id: entityIdSchema.optional(),
    cash_check_voucher_id: EntityIdSchema('Cash Check Voucher is required'),
    name: z.string().min(1, 'Loan Tag name is required'),
    description: z
        .string()
        .min(10, 'Min 5 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),

    color: z.coerce.string().min(1, 'Color is required'),
    icon: z.enum(ICONS),
})

export type TCashCheckVoucherTagSchema = z.infer<
    typeof CashCheckVoucherTagSchema
>
