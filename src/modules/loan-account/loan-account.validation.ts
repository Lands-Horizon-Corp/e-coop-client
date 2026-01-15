import z from 'zod'

import { EntityIdSchema, entityIdSchema } from '@/validation'

export const LoanAccountSchema = z.object({
    id: entityIdSchema.optional(),

    loan_transaction_id: EntityIdSchema('Loan Transaction').optional(),

    account_id: EntityIdSchema('Account').optional(),
    account_history_id: z.any(),

    amount: z.coerce.number<number>().optional(),

    total_add: z.coerce.number().optional(),
    total_add_count: z.coerce.number<number>().int().optional(),

    total_deduction: z.coerce.number<number>().optional(),
    total_deduction_count: z.coerce.number<number>().int().optional(),

    total_payment: z.coerce.number<number>().optional(),
    total_payment_count: z.coerce.number<number>().int().optional(),
})

export type TLoanAccountSchema = z.infer<typeof LoanAccountSchema>
