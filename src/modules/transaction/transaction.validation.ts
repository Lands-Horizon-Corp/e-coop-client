import z from 'zod'

import { amount } from '@/validation'
import { entityIdSchema } from '@/validation'

export const PaymentWithTransactionSchema = z.object({
    amount: amount,

    signature_media_id: entityIdSchema.optional(),
    proof_of_payment_media_id: entityIdSchema.optional(),
    bank_id: entityIdSchema.optional(),
    bank_reference_number: z.string().optional(),
    entry_date: z.string().optional(),
    account_id: entityIdSchema.optional(),
    payment_type_id: entityIdSchema.optional(),

    description: z.string().max(255).optional(),

    // just for viewing
    signature: z.any().optional(),
    proof_of_payment_media: z.any().optional(),
    member: z.any().optional(),
    account: z.any().optional(),
})

export type TPaymentWithTransactionFormValues = z.infer<
    typeof PaymentWithTransactionSchema
>
