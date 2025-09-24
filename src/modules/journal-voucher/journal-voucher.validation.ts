import z from 'zod'

import { descriptionTransformerSanitizer } from '@/validation'

export const JournalVoucherSchema = z.object({
    cash_voucher_number: z.string(),
    date: z.string().min(1, 'Date is required'),
    reference: z.string().optional(),
    status: z.enum(['draft', 'posted', 'cancelled']),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),

    member_profile_id: z.string().optional(),
    member_profile: z.any().optional(),
})

export type TJournalVoucherSchema = z.infer<typeof JournalVoucherSchema>
