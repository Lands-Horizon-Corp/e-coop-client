import z from 'zod'

import {
    dateToISOTransformer,
    descriptionTransformerSanitizer,
    entityIdSchema,
    stringDateSchema,
} from '@/validation'

export const MemberAssetSchema = z.object({
    id: z.string().optional(),
    member_profile_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),
    name: z.string().min(1, 'Asset name is required'),

    cost: z.coerce.number(),
    entry_date: stringDateSchema.transform(dateToISOTransformer),

    description: z.coerce
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),

    media_id: entityIdSchema.optional(),
    media: z.any(),
})
