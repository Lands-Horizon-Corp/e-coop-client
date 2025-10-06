import z from 'zod'

import { entityIdSchema } from '@/validation'

export const LoanTermsAndConditionAmountReceiptSchema = z.object({
    id: entityIdSchema.optional(),
    loan_transaction_id: entityIdSchema.optional(), // auto inserted by server
    account_id: entityIdSchema,
    account: z.any(), // for front end picker only
    amount: z.coerce.number(),
})

export type TLoanTermsAndConditionAmountReceiptSchema = z.infer<
    typeof LoanTermsAndConditionAmountReceiptSchema
>
