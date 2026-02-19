import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

// just for form file UI
const FeedMediaSchema = z.object({
    id: entityIdSchema.optional(),

    // FOR UI ONLY
    media_id: entityIdSchema.optional(),
    media: z.any().optional(), // IMedia if already uploaded
    file: z.instanceof(File).optional(),
    file_preview: z.string().optional(),
})

export const FeedSchema = z.object({
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .max(255, 'Max 255 characters')
        .optional()
        .transform(descriptionTransformerSanitizer),
    feed_medias: z.array(FeedMediaSchema).optional(),
    /*

    { 
        file : File // raw file to be uploaded
        media_id : TEntityId / string
        media : z.any().optional() but can be IMedia which indicates it is already uploaded
    }[]

    */
})

export type TFeedSchema = z.infer<typeof FeedSchema>
