import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

// use by transaction batch create form
export const TransactionBatchCreateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    amount: z.coerce.number().min(0, 'Amount is required'),
    description: z.coerce
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    organization_id: z.string().optional(),
    branch_id: z.string().optional(),
    provided_by_user_id: entityIdSchema
        .min(1, 'Provider is required')
        .optional(),
    provided_by_user: z.any(),
    signature_media_id: z.string().optional(),
    signature_media: z.any(),
})

// ending transaction batch
export const TransactionBatchEndSchema = z.object({
    employee_by_signature_media_id: entityIdSchema.min(
        1,
        'Signature is required'
    ),
    employee_by_signature_media: z.any(),
    employee_by_name: z.string().min(1, 'Name is required'),
    employee_by_position: z.string().min(1, 'Position is required'),
})
