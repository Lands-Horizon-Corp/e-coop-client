import { z } from 'zod'

import {
    amount,
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

const quickTransferEntityIdSchema = (fieldName: string) =>
    z.uuidv4({ error: `${fieldName} is required` })

export const QuickWithdrawSchema = z.object({
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
    account_id: quickTransferEntityIdSchema('Account').min(1),
    payment_type_id: quickTransferEntityIdSchema('Payment type').min(1),

    description: descriptionSchema
        .transform(descriptionTransformerSanitizer)
        .optional(),
    member_profile_id: quickTransferEntityIdSchema('Account').min(1),
    member_joint_account_id: entityIdSchema.optional(),
    reference_number: z
        .string({ error: 'Reference number is required' })
        .min(1),
    or_auto_generated: z.boolean().default(false).optional(),

    //for viewing
    signature: z.any().optional(),
    proof_of_payment_media: z.any().optional(),
    member: z.any().optional(),
    member_joint_account: z.any().optional(),
    account: z.any().optional(),
})

export type TQuickWithdrawSchemaFormValues = z.infer<typeof QuickWithdrawSchema>
