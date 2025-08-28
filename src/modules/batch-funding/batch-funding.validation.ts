import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const BatchFundingSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    amount: z.coerce.number().min(0, 'Amount is required'),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    organization_id: z.string().optional(),
    branch_id: z.string().optional(),
    transaction_batch_id: entityIdSchema.min(1, 'Batch is required'),
    provided_by_user_id: entityIdSchema.min(1, 'Provider is required'),
    provided_by_user: z.any(),
    signature_media_id: z.string().optional(),
    signature_media: z.any(),
})
