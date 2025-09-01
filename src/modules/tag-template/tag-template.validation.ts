import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

import { TAG_CATEGORY } from './tag.constants'

export const TagTemplateSchema = z.object({
    name: z.string().min(1, 'Name is required'),

    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),

    description: z
        .string()
        .min(5, 'Descriptive description is needed')
        .optional()
        .transform(descriptionTransformerSanitizer),
    category: z.enum(TAG_CATEGORY, {
        error: () => ({ message: 'Category is required' }),
    }),
    color: z.string().min(1, 'Color is required'),
    icon: z.string().min(1, 'Icon is required'),
})

export type TTagTemplateSchema = z.infer<typeof TagTemplateSchema>
