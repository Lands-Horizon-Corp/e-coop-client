import z from 'zod'

import { descriptionTransformerSanitizer } from '@/validation'

export const UserOrgPermissionSchema = z.object({
    permission_name: z.string().min(1, 'Permission name is required'),
    permission_description: z
        .string()
        .min(5, 'Please write enough description')
        .optional()
        .transform(descriptionTransformerSanitizer),
    permissions: z
        .array(z.string())
        .min(1, 'At least one permission is required'),
})

export type TUserOrgPermissionSchema = z.infer<typeof UserOrgPermissionSchema>
