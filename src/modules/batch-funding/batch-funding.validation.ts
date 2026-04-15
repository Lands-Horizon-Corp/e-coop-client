import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const BatchFundingSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    amount: z.coerce.number().min(0, 'Amount is required'),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    organization_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),
    transaction_batch_id: entityIdSchema.min(1, 'Batch is required'),
    provided_by_user_id: entityIdSchema.min(1, 'Provider is required'),
    provided_by_user: z.any(),

    currency_id: entityIdSchema,
    currency: z.any(),

    signature_media_id: entityIdSchema.optional(),
    signature_media: z.any(),
})
