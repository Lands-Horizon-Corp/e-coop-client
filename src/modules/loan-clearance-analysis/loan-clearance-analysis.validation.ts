import z from 'zod'

import { entityIdSchema } from '@/validation'

export const loanClearanceAnalysisSchema = z.object({
    loan_transaction_id: entityIdSchema,
    regular_deduction_description: z.string().optional(),
    regular_deduction_amount: z.number().optional(),
    balances_description: z.string().optional(),
    balances_amount: z.number().optional(),
    balances_count: z.number().optional(),
})
export type TLoanClearanceAnalysisFormValues = z.infer<
    typeof loanClearanceAnalysisSchema
>
