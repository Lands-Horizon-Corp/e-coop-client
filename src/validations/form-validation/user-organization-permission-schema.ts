import z from 'zod'

import { descriptionSchema, descriptionTransformerSanitizer } from '../common'

export const userOrgPermissionSchema = z.object({
    permission_name: z.string().min(1, 'Permission name is required'),
    permission_description: descriptionSchema
        .min(1, 'Description is required')
        .transform(descriptionTransformerSanitizer),
    permissions: z
        .array(z.string())
        .min(1, 'At least one permission is required'),
})
