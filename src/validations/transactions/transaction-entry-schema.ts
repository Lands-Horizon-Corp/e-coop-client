import { z } from 'zod'

import {
    TEntityId,
    amount,
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '../common'

export const TransactionEntrySchema = z.object({
    amount: amount,
    entry_date: z.string().optional().nullable(),
    reference_number: z.string().optional(),
    description: descriptionSchema
        .max(255, 'Max 255 character description')
        .transform(descriptionTransformerSanitizer)
        .optional(),
    payment_type_id: TEntityId.min(1, 'Payment type is required').nullable(),
    bank_id: TEntityId.nullable().optional(),
    account_id: TEntityId.min(1, 'Account is required').nullable(),
    signature_media_id: TEntityId.nullable().optional(),
    proof_of_payment_media_id: TEntityId.nullable().optional(),
    bank_reference_number: z.string().optional(),
    signature: z.any().optional(),
    proof_of_payment_media: z.any().optional(),
})

export type TransactionEntryFormValues = z.infer<typeof TransactionEntrySchema>
