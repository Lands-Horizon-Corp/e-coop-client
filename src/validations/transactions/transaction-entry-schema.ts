import { z } from 'zod'

import {
    TEntityId,
    amount,
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '../common'

export const TransactionEntrySchema = z.object({
    amount: amount,
    signature_media_id: TEntityId.optional(),
    proof_of_payment_media_id: TEntityId.optional(),
    bank_id: TEntityId.optional(),
    bank_reference_number: z.string().optional(),
    entry_date: z.string().optional(),
    account_id: TEntityId.min(1, 'Account is required'),
    payment_type_id: TEntityId.min(1, 'Payment type is required'),

    description: descriptionSchema
        .max(255, 'Max 255 character description')
        .transform(descriptionTransformerSanitizer)
        .optional(),
    //for viewing
    signature: z.any().optional(),
    proof_of_payment_media: z.any().optional(),
})

export type TransactionEntryFormValues = z.infer<typeof TransactionEntrySchema>
