import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const LoanTermsAndConditionSuggestedPaymentSchema = z.object({
    id: entityIdSchema.optional(),
    loan_transaction_id: entityIdSchema.optional(), // optional since server will auto set
    name: z.string().min(1, 'Name is required'),
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TLoanTermsAndConditionSuggestedPaymentSchema = z.infer<
    typeof LoanTermsAndConditionSuggestedPaymentSchema
>
