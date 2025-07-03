import z from 'zod'

import { PASSWORD_MIN_LENGTH } from '@/constants'

import { passwordSchema } from '@/validations/common'

export const ResetPasswordSchema = z
    .object({
        newPassword: passwordSchema,
        confirmPassword: z
            .string({ required_error: 'Confirm password' })
            .min(PASSWORD_MIN_LENGTH, `Password doesn't match`),
    })
    .refine(
        ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
        {
            message: "Password doesn't match",
            path: ['confirm_password'],
        }
    )
