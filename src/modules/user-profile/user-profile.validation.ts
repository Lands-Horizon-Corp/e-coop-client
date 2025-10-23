import { z } from 'zod'

import {
    dateToISOTransformer,
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
    passwordSchema,
    stringDateSchema,
} from '@/validation'

import { USER_PROFILE_DURATION_UNITS } from './user-profile.constants'

export const UserProfileSecuritySchema = z
    .object({
        old_password: z.string().min(1, 'Old password is required'),
        new_password: passwordSchema,
        confirm_password: z.string().min(8, 'Please confirm your new password'),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        message: "Passwords don't match",
        path: ['confirm_password'],
    })

export const UserProfileSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, 'Last name is required'),
    suffix: z.string().optional(),
    birthdate: stringDateSchema.transform(dateToISOTransformer),
})

export const UserProfilePhotoUpdateSchema = z.object({
    id: entityIdSchema,
})

export const UserProfileGeneralSchema = z.object({
    user_name: z.string().optional(),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
    email: z.email('Invalid email format').optional(),
    contact_number: z.string().optional(),
})

// Validation Schema
export const UserProfileInactivitySettingsSchema = z.object({
    enabled: z.boolean(),
    duration: z.coerce
        .number()
        .min(1, 'Duration must be at least 1')
        .max(9999, 'Duration is too large')
        .default(1),
    timeUnit: z.enum(USER_PROFILE_DURATION_UNITS).default('minutes'),
})

export type TUserProfileInactivitySettings = z.infer<
    typeof UserProfileInactivitySettingsSchema
>
