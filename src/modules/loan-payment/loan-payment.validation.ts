import z from 'zod'

import {
    EntityIdSchema,
    dateToISOTransformer,
    entityIdSchema,
    stringDateSchema,
} from '@/validation'

export const LoanPayableAccountSchema = z.object({
    account_id: z.string().min(1, 'Account ID is required'),
    transaction_id: z.string().optional(),
    amount: z.coerce.number().min(0, 'Amount must be at least 0'),
    member_profile_id: entityIdSchema.optional(),
    signature_media_id: entityIdSchema.optional(),
    signature_media: z.any().optional(), // FOR UI ONLY

    payment_type_id: EntityIdSchema('Payment type').min(1),
    payment_type: z.any().optional(), // FOR UI ONLY

    proof_of_payment_media_id: entityIdSchema.optional(),
    proof_of_payment_media: z.any().optional(), //FOR UI ONLY

    bank_id: entityIdSchema.optional(),
    bank_reference_number: z.string().optional(),
    // this is bank date, idk why it was called entry date
    entry_date: stringDateSchema.transform(dateToISOTransformer).optional(),

    description: z.string().optional(),
})

export const LoanPayablePaymentSchema = z.object({
    is_reference_number_checked: z.boolean().optional(),
    total_amount: z.number().min(0, 'Total amount must be at least 0'),
    payables: z.array(LoanPayableAccountSchema),
    reference_number: z.string().optional(),
})

export type TLoanPayablePaymentSchema = z.infer<typeof LoanPayablePaymentSchema>
