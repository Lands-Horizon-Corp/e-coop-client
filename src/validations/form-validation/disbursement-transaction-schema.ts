import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'

export const disbursementTransactionSchema = z.object({
    disbursement_id: entityIdSchema.optional(),
    transaction_batch_id: entityIdSchema.optional(),
    disbursement: z.any(),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
    is_reference_number_checked: z.boolean(),
    reference_number: z.coerce.string(),
    amount: z.coerce.number(),
})
