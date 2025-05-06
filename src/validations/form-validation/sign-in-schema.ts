import z from 'zod'
import { emailSchema } from '../common'

export const signInSchema = z.object({
    email: emailSchema,
    password: z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is empty'),
})
