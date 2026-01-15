import z from 'zod'

import { entityIdSchema } from '@/validation'

export const AccountTransactionEntrySchema = z.object({
    id: entityIdSchema.optional(),

    account_transaction_id: z.any(),
    account_transaction: z.any(),

    account_id: entityIdSchema,
    account: z.any(),

    debit: z.coerce.number<string>().default(0),
    credit: z.coerce.number<string>().default(0),
})

export type TAccountTransactionEntrySchema = z.infer<
    typeof AccountTransactionEntrySchema
>
