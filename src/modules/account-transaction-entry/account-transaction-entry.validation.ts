import z from 'zod'

import { EntityIdSchema, entityIdSchema } from '@/validation'

export const AccountTransactionEntrySchema = z.object({
    id: entityIdSchema.optional(),

    account_transaction_id: EntityIdSchema,
    account_transaction: z.any(),

    account_id: EntityIdSchema,
    account: z.any(),

    debit: z.coerce.number<string>().default(0),
    credit: z.coerce.number<string>().default(0),
})

export type TAccountTransactionEntrySchema = z.infer<
    typeof AccountTransactionEntrySchema
>
