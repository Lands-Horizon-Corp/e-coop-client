import z from 'zod'

import {
    EntityIdSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

export const FeedCommentSchema = z.object({
    id: entityIdSchema.optional(),

    comment: z
        .string()
        .min(1, 'Comment is requred')
        .optional()
        .transform(descriptionTransformerSanitizer),

    meda_id: EntityIdSchema('Valid media is required').optional(),
    media: z.any().optional(),
})

export type TFeedCommentSchema = z.infer<typeof FeedCommentSchema>
