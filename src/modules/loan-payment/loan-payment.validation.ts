import z from 'zod'

import {
    EntityIdSchema,
    dateToISOTransformer,
    entityIdSchema,
    stringDateSchema,
} from '@/validation'

export const LoanPayableAccountSchema = z.object({
    account_id: z.string().min(1, 'Account ID is required'),
    account: z.any().optional(),

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

    // FOR SUGGESTION ONLY
    suggested_payment_amount: z.coerce.number().min(0).optional(), //
    is_past_due: z.boolean().optional(),
    last_payment_date: z.coerce.string().optional(),
    supposed_payment_date: z.coerce.string().optional(),
    payment_schedule: z.any().optional(),
})

export const LoanPayablePaymentSchema = z.object({
    is_reference_number_checked: z.boolean().optional(),
    total_amount: z.coerce.number().min(0, 'Total amount must be at least 0'),
    payables: z.array(LoanPayableAccountSchema),
    reference_number: z.string(),
})

export type TLoanPayablePaymentSchema = z.infer<typeof LoanPayablePaymentSchema>
