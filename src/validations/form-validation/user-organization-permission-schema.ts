import z from 'zod'

export const userOrgPermissionSchema = z.object({
    permission_name: z.string().min(1, 'Permission name is required'),
    permission_description: z.string().min(1, 'Description is required'),
    permissions: z
        .array(z.string())
        .min(1, 'At least one permission is required'),
})
