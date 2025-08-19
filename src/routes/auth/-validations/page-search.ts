import z from 'zod'

import { emailSchema } from '@/validation'

export const SignInPageSearchSchema = z.object({
    key: emailSchema.optional(),
})

export const ForgotPasswordPageSearchSchema = z.object({
    key: emailSchema.optional(),
})
