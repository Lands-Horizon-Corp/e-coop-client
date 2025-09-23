import z from 'zod'

import { descriptionTransformerSanitizer } from '@/validation'

export const JournalVoucherSchema = z.object({
    cash_voucher_number: z.string().min(1, 'Cash voucher number is required'),
    date: z.string().min(1, 'Date is required'),
    reference: z.string().min(1, 'Reference is required'),
    status: z.string().min(1, 'Reference is required'),
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),

    member_profile_id: z.string().optional(),
    member_profile: z.any().optional(),
})

export type TJournalVoucherSchema = z.infer<typeof JournalVoucherSchema>
