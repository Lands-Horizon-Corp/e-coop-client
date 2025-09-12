import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const LoanClearanceAnalysisInstitutionSchema = z.object({
    id: entityIdSchema.optional(),
    name: z
        .string()
        .min(1, 'LoanClearanceAnalysisInstitution name is required'),
    loan_transaction_id: entityIdSchema.optional(),
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TLoanClearanceAnalysisInstitutionSchema = z.infer<
    typeof LoanClearanceAnalysisInstitutionSchema
>
