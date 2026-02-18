import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

// just for form file UI
const FeedMediaSchema = z.object({
    file: z.instanceof(File).optional(),
    filePreview: z.base64().optional(),
    media_id: entityIdSchema.optional(),
    media: z.any().optional(), // IMedia if already uploaded
})

export const FeedSchema = z.object({
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .max(255, 'Max 255 characters')
        .optional()
        .transform(descriptionTransformerSanitizer),
    media_ids: z.array(entityIdSchema).optional(),

    media: z.array(FeedMediaSchema).optional(),
    /*

    { 
        file : File // raw file to be uploaded
        media_id : TEntityId / string
        media : z.any().optional() but can be IMedia which indicates it is already uploaded
    }[]

    */
})

export type TFeedSchema = z.infer<typeof FeedSchema>
