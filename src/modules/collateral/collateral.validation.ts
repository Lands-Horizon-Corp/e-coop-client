import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const CollateralSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    icon: z.string().min(1, 'Icon is required'),
})

export type TCollateralSchema = z.infer<typeof CollateralSchema>
