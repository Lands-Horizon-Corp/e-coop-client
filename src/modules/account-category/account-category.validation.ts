import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '@/validation'

export const AccountCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type AccountCategoryFormValues = z.infer<typeof AccountCategorySchema>
