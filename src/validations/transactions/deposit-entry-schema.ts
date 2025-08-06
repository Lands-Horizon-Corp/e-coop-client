import { z } from 'zod'

import { TEntityId, amount } from '../common'

export const QuickTransactionPaymentSchema = z.object({
    amount: amount,
    signature_media_id: TEntityId.nullable().optional(),
    proof_of_payment_media_id: TEntityId.nullable().optional(),
    bank_id: TEntityId.nullable().optional(),
    bank_reference_number: z.string().min(1).max(255).optional(),

    entry_date: z.string().nullable().optional(),
    account_id: TEntityId.nullable(),

    payment_type_id: TEntityId.nullable(),

    description: z.string().max(255).optional(),
    // just for viewing
    signature: z.any().optional(),
    proof_of_payment_media: z.any().optional(),
    member: z.any().optional(),

    member_profile_id: TEntityId.min(
        1,
        'Member profile is required'
    ).nullable(),
    member_joint_account_id: TEntityId.nullable().optional(),
    reference_number: z.string().min(1, 'Reference number is required'),
    or_auto_generated: z.boolean().default(false),
})

export type DepositEntryFormValues = z.infer<
    typeof QuickTransactionPaymentSchema
>
