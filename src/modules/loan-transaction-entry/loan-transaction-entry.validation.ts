import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

import { LOAN_TRANSACTION_ENTRY_TYPE } from './loan-transaction-constant'

export const LoanTransactionEntrySchema = z.object({
    id: entityIdSchema.optional(),
    loan_transaction_id: entityIdSchema.optional(),

    index: z.number().int().min(0).optional(),

    account_id: entityIdSchema.optional(),
    account: z.any().optional(),

    name: z.coerce.string().default('Unknown'), // Just Copy of account name so incase account has been deleted, this still exist
    description: z.coerce
        .string()
        .default('empty description')
        .transform(descriptionTransformerSanitizer), // Just Copy of account name so incase account has been deleted, this still exist

    amount: z.coerce.number().min(0, 'Amount must be positive'),

    credit: z.coerce.number().min(0, 'Credit must be positive').optional(),
    debit: z.coerce.number().min(0, 'Debit must be positive').optional(),

    is_add_on: z.boolean().optional().default(false), //

    type: z.enum(LOAN_TRANSACTION_ENTRY_TYPE).default('deduction'), //
})

export type TLoanTransactionEntrySchema = z.infer<
    typeof LoanTransactionEntrySchema
>
