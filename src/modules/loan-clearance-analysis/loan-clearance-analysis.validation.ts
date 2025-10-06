import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const LoanClearanceAnalysisSchema = z.object({
    id: entityIdSchema.optional(),

    loan_transaction_id: entityIdSchema.optional(),

    regular_deduction_description: z.coerce
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),

    regular_deduction_amount: z.coerce
        .number('Invalid regular deduction amount')
        .min(0, 'Regular deduction amount must be positive')
        .optional(),

    balances_description: z.coerce
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),

    balances_amount: z.coerce
        .number('Invalid balances amount')
        .min(0, 'Balances amount must be positive')
        .optional(),

    balances_count: z.coerce
        .number('Invalid balances count')
        .int('Balances count must be an integer')
        .min(0, 'Balances count must be positive')
        .optional(),
})

export type TLoanClearanceAnalysisSchema = z.infer<
    typeof LoanClearanceAnalysisSchema
>
