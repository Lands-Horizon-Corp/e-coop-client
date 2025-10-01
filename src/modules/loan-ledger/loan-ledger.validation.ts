import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const LoanLedgerSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'LoanLedger name is required'),
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TLoanLedgerSchema = z.infer<typeof LoanLedgerSchema>
