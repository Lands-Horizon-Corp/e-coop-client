import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '@/validation'

export const AccountClassificationSchema = z.object({
    name: z.string().min(1, 'Classification name is required'),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type AccountClassificationFormValues = z.infer<
    typeof AccountClassificationSchema
>
