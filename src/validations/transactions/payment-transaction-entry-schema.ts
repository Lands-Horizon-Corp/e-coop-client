import { z } from 'zod'

import { TEntityId, amount } from '../common'

export const PaymentWithTransactionSchema = z.object({
    amount: amount,

    signature_media_id: TEntityId.optional(),
    proof_of_payment_media_id: TEntityId.optional(),
    bank_id: TEntityId.optional(),
    bank_reference_number: z.string().optional(),
    entry_date: z.string().optional(),
    account_id: TEntityId.optional(),
    account: z.any().optional(),
    payment_type_id: TEntityId.optional(),

    description: z.string().max(255).optional(),

    // just for viewing
    signature: z.any().optional(),
    proof_of_payment_media: z.any().optional(),
    member: z.any().optional(),
})

export type PaymentWithTransactionFormValues = z.infer<
    typeof PaymentWithTransactionSchema
>
