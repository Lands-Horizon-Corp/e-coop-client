import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const FeedSchema = z.object({
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
    media_ids: z.array(entityIdSchema).optional(),
})

export type TFeedSchema = z.infer<typeof FeedSchema>
