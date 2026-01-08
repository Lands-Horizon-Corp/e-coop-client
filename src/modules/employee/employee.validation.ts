import z from 'zod'

import {
    EntityIdSchema,
    emailSchema,
    stringDateWithTransformSchema,
} from '@/validation'

export const EmployeeCreateSchema = z
    .object({
        first_name: z.coerce.string().min(1).max(255),
        middle_name: z.coerce.string().max(255).optional(),
        last_name: z.coerce.string().min(1).max(255),
        full_name: z.coerce.string().max(255).optional(),
        suffix: z.coerce.string().max(50).optional(),

        birthdate: stringDateWithTransformSchema,

        contact_number: z.coerce
            .string()
            .min(1, 'Contact number is required')
            .max(255)
            .optional(),
        user_name: z.coerce.string().min(1).max(255),
        email: emailSchema,
        password: z.coerce.string().min(6).max(128),
        confirm_password: z.coerce.string().min(6).max(128),

        media_id: EntityIdSchema('Photo is required'),
        media: z.any(),

        application_description: z.coerce.string().optional(),
        permission_name: z.coerce.string().min(1),
        permission_description: z.coerce.string().min(1),
        permissions: z
            .array(z.string())
            .min(1, 'At least one permission is required'),
    })
    .refine(
        (data) => {
            if (data.password !== data.confirm_password) return false
            return true
        },
        { error: 'Password not match' }
    )

export type TEmployeeCreateSchema = z.infer<typeof EmployeeCreateSchema>
