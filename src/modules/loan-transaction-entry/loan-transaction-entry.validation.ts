import z from 'zod'

import { entityIdSchema } from '@/validation'

import { LOAN_TRANSACTION_ENTRY_TYPE } from './loan-transaction-constant'

export const LoanTransactionEntrySchema = z
    .object({
        account_id: entityIdSchema,
        account: z.any(),
        amount: z.coerce.number().min(0, 'Amount must be positive'),
        description: z.coerce.string().optional(),
        is_add_on: z.boolean().default(false),
        type: z.enum(LOAN_TRANSACTION_ENTRY_TYPE).optional(),
    })
    .refine(
        (data) => {
            return !(data.type !== 'automatic-deduction' && data.amount <= 0)
        },
        {
            message: 'Amount is required',
            path: ['amount'],
        }
    )

export type TLoanTransactionEntrySchema = z.infer<
    typeof LoanTransactionEntrySchema
>
