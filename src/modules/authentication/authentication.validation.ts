import { z } from 'zod'

import { PASSWORD_MIN_LENGTH } from '@/constants'
import {
    contactNumberSchema,
    emailSchema,
    entityIdSchema,
    firstNameSchema,
    lastNameSchema,
    middleNameSchema,
    otpCodeSchema,
    passwordSchema,
    stringDateSchema,
    userNameSchema,
} from '@/validation'
import { isBefore, startOfDay } from 'date-fns'

// Define the Zod schema for UserLoginRequest
export const UserLoginRequestSchema = z.object({
    key: z.string().min(1),
    password: z.string().min(8),
})

// Define the Zod schema for UserRegisterRequest
export const UserRegisterRequestSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    birthdate: z.string().optional(),
    user_name: z.string().min(3).max(100),
    full_name: z.string().optional(),
    first_name: z.string().optional(),
    middle_name: z.string().optional(),
    last_name: z.string().optional(),
    suffix: z.string().optional(),
    contact_number: z.string().min(7).max(20),
    media_id: entityIdSchema.optional(),
})

// OTP Schema
export const OtpSchema = z.object({
    otp: otpCodeSchema,
})

// Define the Zod schema for UserForgotPasswordRequest
export const UserForgotPasswordRequestSchema = z.object({
    key: z.string().min(1),
})

// Define the Zod schema for UserChangePasswordRequest
export const UserChangePasswordRequestSchema = z.object({
    new_password: z.string().min(8),
    confirm_password: z.string().min(8),
})

// Define the Zod schema for UserVerifyContactNumberRequest
export const UserVerifyContactNumberRequestSchema = z.object({
    otp: z.string().min(6),
})

// Define the Zod schema for UserVerifyEmailRequest
export const UserVerifyEmailRequestSchema = z.object({
    otp: z.string().min(6),
})

// Define the Zod schema for UserSettingsChangePasswordRequest
export const UserSettingsChangePasswordRequestSchema = z.object({
    old_password: z.string().min(8),
    new_password: z.string().min(8),
    confirm_password: z.string().min(8),
})

// Define the Zod schema for UserSettingsChangeEmailRequest
export const UserSettingsChangeEmailRequestSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

// Define the Zod schema for UserSettingsChangeUsernameRequest
export const UserSettingsChangeUsernameRequestSchema = z.object({
    user_name: z.string().min(3).max(100),
    password: z.string().min(8),
})

// Define the Zod schema for UserSettingsChangeContactNumberRequest
export const UserSettingsChangeContactNumberRequestSchema = z.object({
    contact_number: z.string().min(7).max(20),
    password: z.string().min(8),
})

// Define the Zod schema for UserSettingsChangeProfilePictureRequest
export const UserSettingsChangeProfilePictureRequestSchema = z.object({
    media_id: entityIdSchema,
})

// Define the Zod schema for UserSettingsChangeProfileRequest
export const UserSettingsChangeProfileRequestSchema = z.object({
    birthdate: z.string(),
    description: z.string().optional(),
    first_name: z.string().optional(),
    middle_name: z.string().optional(),
    last_name: z.string().optional(),
    full_name: z.string().optional(),
    suffix: z.string().optional(),
})

// Define the Zod schema for UserSettingsChangeGeneralRequest
export const UserSettingsChangeGeneralRequestSchema = z.object({
    contact_number: z.string().min(7).max(20),
    description: z.string().optional(),
    email: z.email(),
    user_name: z.string().min(3).max(100),
})

export const ResetPasswordSchema = z
    .object({
        new_password: passwordSchema,
        confirm_password: z
            .string({ error: 'Confirm password' })
            .min(PASSWORD_MIN_LENGTH, `Password doesn't match`),
    })
    .refine(
        ({ new_password, confirm_password }) =>
            new_password === confirm_password,
        {
            message: "Password doesn't match",
            path: ['confirm_password'],
        }
    )

// For sign in
export const SignInSchema = z.object({
    key: emailSchema,
    password: z
        .string({ error: 'Password is required' })
        .min(1, 'Password is empty'),
})

// For sign up

export const SignUpSchema = z.object({
    email: emailSchema,
    user_name: userNameSchema,
    first_name: firstNameSchema,
    middle_name: middleNameSchema,
    last_name: lastNameSchema,
    full_name: z.string().min(1, 'full name is required'),
    suffix: z.string().optional(),

    birthdate: stringDateSchema.refine(
        (val) => {
            const date = startOfDay(new Date(val))
            const now = startOfDay(new Date())
            return isBefore(date, now)
        },
        { message: 'Birthdate must be in the past' }
    ),

    contact_number: contactNumberSchema,
    password: passwordSchema,

    accept_terms: z
        .boolean()
        .default(false)
        .refine(
            (val) => {
                return val === true
            },
            {
                message: 'You must accept the terms and conditions',
            }
        ),
})
