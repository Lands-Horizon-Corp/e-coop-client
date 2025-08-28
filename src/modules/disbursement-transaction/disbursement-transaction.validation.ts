import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const DisbursementTransactionSchema = z.object({
    disbursement_id: entityIdSchema.optional(),
    transaction_batch_id: entityIdSchema.optional(),
    disbursement: z.any(),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    is_reference_number_checked: z.boolean(),
    reference_number: z.coerce.string(),
    amount: z.coerce.number(),
})

export type TDisbursementTransactionFormValue = z.infer<
    typeof DisbursementTransactionSchema
>
