import z from 'zod'

import {
    EntityIdSchema,
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

export const PaymentWithTransactionSchema = z.object({
    amount: z
        .number({ error: 'Amount is required' })
        .min(0.01)
        .max(1000000000, {
            message: 'Amount must be less than or equal to 1,000,000,000',
        }),
    signature_media_id: entityIdSchema.optional(),
    proof_of_payment_media_id: entityIdSchema.optional(),
    bank_id: entityIdSchema.optional(),
    bank_reference_number: z.string().optional(),
    entry_date: z
        .string({ error: 'Entry date mus be a valid date' })
        .optional(),
    account_id: EntityIdSchema('Account').min(1),
    payment_type_id: EntityIdSchema('Payment type').min(1),
    description: descriptionSchema
        .transform(descriptionTransformerSanitizer)
        .optional(),

    //for viewing
    signature: z.any().optional(),
    proof_of_payment_media: z.any().optional(),
    member: z.any().optional(),
    account: z.any().optional(),
})
export const QuickWithdrawSchema = z.object({})

export type TPaymentWithTransactionFormValues = z.infer<
    typeof PaymentWithTransactionSchema
>
