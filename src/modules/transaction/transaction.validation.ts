import z from 'zod';



import { EntityIdSchema, descriptionTransformerSanitizer, entityIdSchema } from '@/validation';





export const PaymentWithTransactionSchema = z.object({
    reference_number: z.string().min(1, 'Reference number is required'),
    amount: z.coerce
        .number({ error: 'Amount is required' })
        .refine((val) => val !== 0, '0 Amount is not allowed'),
    signature_media_id: entityIdSchema.optional(),
    proof_of_payment_media_id: entityIdSchema.optional(),
    bank_id: entityIdSchema.optional(),
    bank_reference_number: z.string().optional(),
    entry_date: z
        .string({ error: 'Entry date mus be a valid date' })
        .optional(),
    account_id: EntityIdSchema('Account').min(1),
    payment_type_id: EntityIdSchema('Payment type').min(1),
    description: z.coerce
        .string<string>({ error: 'Description is must be a string' })
        .transform(descriptionTransformerSanitizer)
        .optional(),
    or_auto_generated: z.boolean().optional(),

    //for viewing
    signature: z.any().optional(),
    proof_of_payment_media: z.any().optional(),
    member: z.any().optional(),
    account: z.any().optional(),
})
export type TPaymentWithTransactionFormValues = z.infer<
    typeof PaymentWithTransactionSchema
>
