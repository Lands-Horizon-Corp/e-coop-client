import z from 'zod'

import { entityIdSchema } from '@/validation'

export const loanClearanceAnalysisInstitutionSchema = z.object({
    loan_transaction_id: entityIdSchema,
    name: z.string().min(1).max(50),
    description: z.string().optional(),
})
export type TLoanClearanceAnalysisInstitutionFormValues = z.infer<
    typeof loanClearanceAnalysisInstitutionSchema
>
