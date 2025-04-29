import z from 'zod'
import { emailSchema, userAccountTypeSchema } from '@/validations/common'

export const SignInPageSearchSchema = z.object({
    key: z.string().optional(),
    accountType: z
        .string()
        .optional()
        .default('Member')
        .pipe(userAccountTypeSchema)
        .catch('Member'),
})

export const ForgotPasswordPageSearchSchema = z.object({
    key: z.string().optional().default('').or(emailSchema),
    accountType: z
        .string()
        .optional()
        .default('Member')
        .pipe(userAccountTypeSchema)
        .catch('Member'),
})
