import z from 'zod'

import { descriptionSchema } from '@/validation'
import { isValidPhoneNumber } from 'react-phone-number-input'

export const contactUsSchema = z.object({
    first_name: z
        .string({ error: 'First name is required' })
        .min(1, 'Last name is required'),
    last_name: z
        .string({ error: 'Last name is required' })
        .min(1, 'Last name is required'),
    email: z.email('Email must be valid'),
    contact_number: z
        .string()
        .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
    description: descriptionSchema
        .min(20, 'Message must be at least 20 characters long')
        .max(100, 'Message must not exceed 100 characters'),
})
