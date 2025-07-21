import { z } from 'zod'

import { descriptionSchema, descriptionTransformerSanitizer } from '../common'

export const TBankSchema = z.object({
    mediaId: z.string().min(1, 'media id. is required'),
    name: z.string().min(1, 'Bank name is required'),
    description: descriptionSchema
        .min(15, 'Bank Description is required')
        .transform(descriptionTransformerSanitizer),
})
