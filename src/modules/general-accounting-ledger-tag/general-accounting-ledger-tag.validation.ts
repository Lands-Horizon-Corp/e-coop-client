import z from 'zod'

import { descriptionSchema, entityIdSchema } from '@/validation'

export const generalLedgerTagSchema = z.object({
    general_ledger_id: entityIdSchema,
    name: z.string().min(1).max(50),
    description: descriptionSchema.optional(),
    category: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
})
export type TGeneralLedgerTagFormValues = z.infer<typeof generalLedgerTagSchema>
