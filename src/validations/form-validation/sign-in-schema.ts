import z from 'zod'
import { emailSchema, userAccountTypeSchema } from '../common'

export const signInSchema = z.object({
    key: emailSchema,
    password: z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is empty'),
    accountType: userAccountTypeSchema.default('member'),
})
