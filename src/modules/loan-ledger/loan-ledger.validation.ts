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

export const LoanLedgerChangeLineSchema = z.object({
    line_number: z.coerce.number().int().min(1, 'Line number is required'),
})

export type TLoanLedgerChangeLineSchema = z.infer<
    typeof LoanLedgerChangeLineSchema
>
