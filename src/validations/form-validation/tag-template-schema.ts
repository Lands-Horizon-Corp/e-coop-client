import z from 'zod'

import { TAG_CATEGORY } from '@/constants'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'

export const tagTemplateSchema = z.object({
    name: z.string().min(1, 'Name is required'),

    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),

    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
    category: z.enum(TAG_CATEGORY, {
        errorMap: () => ({ message: 'Category is required' }),
    }),
    color: z.string().min(1, 'Color is required'),
    icon: z.string().min(1, 'Icon is required'),
})
