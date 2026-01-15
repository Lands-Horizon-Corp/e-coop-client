import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '@/validation'

export const AccountCategorySchema = z.object({
    name: z
        .string({
            error: 'Category name must be a string',
        })
        .min(1, 'Category name cannot be empty')
        .max(255, 'Category name must not exceed 255 characters'),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type AccountCategoryFormValues = z.infer<typeof AccountCategorySchema>
