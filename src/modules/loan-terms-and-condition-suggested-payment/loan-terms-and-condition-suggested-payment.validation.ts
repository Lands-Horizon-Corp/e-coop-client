import z from 'zod'

import { entityIdSchema } from '@/validation'

export const loanTermsAndConditionSuggestedPaymentSchema = z.object({
    loan_transaction_id: entityIdSchema,
})

export type TLoanTermsAndConditionSuggestedPaymentFormValues = z.infer<
    typeof loanTermsAndConditionSuggestedPaymentSchema
>
