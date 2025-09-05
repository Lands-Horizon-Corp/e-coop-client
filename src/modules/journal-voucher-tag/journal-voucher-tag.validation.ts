import z from 'zod'

import { entityIdSchema } from '@/validation'

export const journalVoucherTagSchema = z.object({
    journal_voucher_id: entityIdSchema,
    name: z.string().max(50).optional(),
    description: z.string().optional(),
    category: z.string().max(50).optional(),
    color: z.string().max(20).optional(),
    icon: z.string().max(20).optional(),
})
export type TJournalVoucherTagFormValues = z.infer<
    typeof journalVoucherTagSchema
>
