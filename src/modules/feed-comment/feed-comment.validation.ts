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
        .min(1, 'Comment should not be empty')
        .max(255, 'Max 255 characters')
        .optional()
        .transform(descriptionTransformerSanitizer),

    file: z.file().optional(),
    filePreview: z.string().optional(),
    media_id: EntityIdSchema('Valid media is required').optional(),
    media: z.any().optional(),
})

export type TFeedCommentSchema = z.infer<typeof FeedCommentSchema>
