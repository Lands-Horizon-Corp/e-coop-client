import z from 'zod'

import { entityIdSchema } from '@/validation'

export const loanTermsAndConditionAmountReceiptSchema = z.object({
    loan_transaction_id: entityIdSchema,
    account_id: entityIdSchema,
    amount: z.number().optional(),
})

export type TLoanTermsAndConditionAmountFormValues = z.infer<
    typeof loanTermsAndConditionAmountReceiptSchema
>
