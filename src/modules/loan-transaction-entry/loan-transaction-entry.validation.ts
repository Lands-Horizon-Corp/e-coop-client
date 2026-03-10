import z from 'zod'

import { EntityIdSchema, entityIdSchema } from '@/validation'

import { LOAN_TRANSACTION_ENTRY_TYPE } from './loan-transaction-constant'

export const LoanTransactionEntrySchema = z
    .object({
        account_id: entityIdSchema,
        account: z.any(),
        amount: z.coerce.number().min(0, 'Amount must be positive'),
        description: z.coerce.string().optional(),
        is_add_on: z.boolean().default(false),
        type: z.enum(LOAN_TRANSACTION_ENTRY_TYPE).optional(),

        member_profile_id: EntityIdSchema('Invalid Member').optional(),
        member_profile: z.any().optional(),

        member_loan_transaction_id: EntityIdSchema('Invalid Loan').optional(),
        member_loan_transaction: z.any().optional(),
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
