import z from 'zod'

import { entityIdSchema } from '@/validation'

export const LoanTransactionEntrySchema = z.object({
    account_id: entityIdSchema,
    account: z.any(),
    amount: z.coerce.number().min(0, 'Amount must be positive'),
    description: z.coerce.string().optional(),
    is_add_on: z.boolean().default(false),
})

export type TLoanTransactionEntrySchema = z.infer<
    typeof LoanTransactionEntrySchema
>
