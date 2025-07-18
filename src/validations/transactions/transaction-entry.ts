import { z } from 'zod'

import { GENERAL_LEDGER_SOURCE } from '@/types'

import { TEntityId, amount } from '../common'

export const TransactionEntrySchema = z.object({
    amount: amount,
    general_ledger_source: z.enum(GENERAL_LEDGER_SOURCE),
    payment_date: z.string().optional(),
    reference_number: z.string().optional(),
    account_id: TEntityId,
    //member_profile_id: TEntityId,
})

export type TransactionEntryFormValues = z.infer<typeof TransactionEntrySchema>
