import z from 'zod'
import { emailSchema } from '@/validations/common'

export const SignInPageSearchSchema = z.object({
    email: emailSchema.optional(),
})

export const ForgotPasswordPageSearchSchema = z.object({
    email: emailSchema.optional(),
})
