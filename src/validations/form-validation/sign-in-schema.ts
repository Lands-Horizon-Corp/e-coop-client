import z from 'zod'
import { userAccountTypeSchema } from '../common'

export const signInSchema = z.object({
    key: z.string().min(1, 'email, username, or contact is required'),
    password: z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is empty'),
    accountType: userAccountTypeSchema.default('member'),
})
