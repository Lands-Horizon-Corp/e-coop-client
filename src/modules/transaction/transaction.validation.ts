import z from 'zod'

import {
    EntityIdSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
    stringDateWithTransformSchema,
} from '@/validation'

export const PaymentWithTransactionSchema = z.object({
    reference_number: z.string().min(1, 'Reference number is required'),
    amount: z.coerce
        .number({ error: 'Amount is required' })
        .refine((val) => val !== 0, '0 Amount is not allowed'),
    signature_media_id: entityIdSchema.optional(),
    proof_of_payment_media_id: entityIdSchema.optional(),
    bank_id: entityIdSchema.optional(),
    bank_reference_number: z.string().optional(),
    entry_date: stringDateWithTransformSchema.optional(),
    account_id: EntityIdSchema('Account').min(1),

    loan_transaction_id: EntityIdSchema('Loan transaction').optional(),
    loan_transaction: z.any().optional(),

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

export const TransactionSchema = z.object({
    signature_media_id: entityIdSchema.optional(),
    member_profile_id: EntityIdSchema('Member Profile').min(1),
    member_joint_account_id: EntityIdSchema('Member Joint Account').optional(),
    reference_number: z.string().min(1, 'Reference number is required'),
    is_reference_number_checked: z.boolean().optional(),
    description: z.coerce
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    currency_id: EntityIdSchema('Currency').min(1),
})

export type TTransactionSchema = z.infer<typeof TransactionSchema>

export type TPaymentWithTransactionFormValues = z.infer<
    typeof PaymentWithTransactionSchema
>
