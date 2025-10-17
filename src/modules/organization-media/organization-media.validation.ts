import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const OrganizationMediaSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'OrganizationMedia name is required'),
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
    organization_id: entityIdSchema,
    organization: z.any(),
    media_id: entityIdSchema,
    media: z.any(),
})

export type TOrganizationMediaSchema = z.infer<typeof OrganizationMediaSchema>
