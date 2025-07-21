import { z } from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
    passwordSchema,
} from '../common'

export const userSettingsSecuritySchema = z
    .object({
        old_password: z.string().min(1, 'Old password is required'),
        new_password: passwordSchema,
        confirm_password: z.string().min(8, 'Please confirm your new password'),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        message: "Passwords don't match",
        path: ['confirm_password'],
    })

export const userSettingsProfileSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, 'Last name is required'),
    suffix: z.string().optional(),
})

export const userSettingsPhotoUpdateSchema = z.object({
    id: entityIdSchema,
})

export const userSettingsGeneralSchema = z.object({
    user_name: z.string().optional(),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
    email: z.string().email('Invalid email format').optional(),
    contact_number: z.string().optional(),
})
