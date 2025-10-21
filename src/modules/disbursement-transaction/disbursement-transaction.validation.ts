import z from 'zod'

import {
    EntityIdSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

export const DisbursementTransactionSchema = z.object({
    disbursement_id: EntityIdSchema('Disbursement type is required').optional(),
    disbursement: z.any().optional(),

    transaction_batch_id: entityIdSchema.optional(),

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
