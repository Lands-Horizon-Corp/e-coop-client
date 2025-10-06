import z from 'zod'

import { descriptionTransformerSanitizer } from '@/validation'

export const CancelledCashCheckVoucherSchema = z.object({
    check_number: z
        .string()
        .min(1, 'Check number is required')
        .max(255, 'Max 255 character check number')
        .optional(),
    entry_date: z.string().min(1, 'Entry date is required'),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TCancelledCashCheckVoucherSchema = z.infer<
    typeof CancelledCashCheckVoucherSchema
>
