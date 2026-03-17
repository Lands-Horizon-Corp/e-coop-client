import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

import { TAG_CATEGORY } from '../tag-template/tag.constants'

export const InventoryTagSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'InventoryTag name is required'),

    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
    category: z.enum(TAG_CATEGORY).optional(),

    color: z.string().optional(),
    icon: z.string().optional(),
})

export type TInventoryTagSchema = z.infer<typeof InventoryTagSchema>
