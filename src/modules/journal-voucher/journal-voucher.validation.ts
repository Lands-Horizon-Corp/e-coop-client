import z from 'zod'

import { EntityIdSchema, descriptionTransformerSanitizer } from '@/validation'

export const JournalVoucherSchema = z.object({
    id: z.string().optional(),
    cash_voucher_number: z.coerce.string<string>().optional(),
    date: z.string().min(1, 'Date is required'),
    reference: z.coerce.string<string>().optional(),
    status: z
        .enum(['draft', 'printed', 'approved', 'released'])
        .default('draft')
        .optional(),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),

    name: z.string().optional(),

    currency_id: EntityIdSchema('Currency is required'),
    currency: z.any(),

    company_id: z.string().optional(),
    member_id: z.string().optional(),
    member_profile: z.any().optional(),
})

export const JournalVoucherPrintSchema = z.object({
    cash_voucher_number: z.string().min(1, 'Voucher Number is required'),
})

export type TJournalVoucherSchema = z.infer<typeof JournalVoucherSchema>
export type TJournalVoucherPrintSchema = z.infer<
    typeof JournalVoucherPrintSchema
>
