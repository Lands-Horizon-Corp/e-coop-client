import { z } from 'zod'

import {
    TEntityId,
    amount,
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '../common'

export const QuickWithdrawSchema = z.object({
    amount: amount,
    signature_media_id: TEntityId.optional(),
    proof_of_payment_media_id: TEntityId.optional(),
    bank_id: TEntityId.optional(),
    bank_reference_number: z.string().optional(),
    entry_date: z.string().optional(),
    account_id: TEntityId.min(1, 'Account is required'),
    payment_type_id: TEntityId.min(1, 'Payment type is required'),

    description: descriptionSchema
        .transform(descriptionTransformerSanitizer)
        .optional(),
    member_profile_id: TEntityId.min(1, 'Member is required'),
    member_joint_account_id: TEntityId.optional(),
    reference_number: z.string().min(1, 'Reference number is required'),
    or_auto_generated: z.boolean().default(false),

    //for viewing
    signature: z.any().optional(),
    proof_of_payment_media: z.any().optional(),
    member: z.any().optional(),
    member_joint_account: z.any().optional(),
    account: z.any().optional(),
})

export type QuickWithdrawSchemaFormValues = z.infer<typeof QuickWithdrawSchema>
