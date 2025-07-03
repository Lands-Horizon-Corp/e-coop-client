import z from 'zod'

import { emailSchema } from '@/validations/common'

export const SignInPageSearchSchema = z.object({
    key: emailSchema.optional(),
})

export const ForgotPasswordPageSearchSchema = z.object({
    key: emailSchema.optional(),
})
