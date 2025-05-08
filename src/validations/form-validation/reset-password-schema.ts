import z from 'zod'

import { PASSWORD_MIN_LENGTH } from '@/constants'
import { passwordSchema } from '@/validations/common'

export const ResetPasswordSchema = z
    .object({
        new_password: passwordSchema,
        confirm_password: z
            .string({ required_error: 'Confirm password' })
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
