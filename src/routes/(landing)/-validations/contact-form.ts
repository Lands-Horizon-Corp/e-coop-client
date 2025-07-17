import z from 'zod'

import { isValidPhoneNumber } from 'react-phone-number-input'

export const contactFormSchema = z.object({
    first_name: z
        .string({ required_error: 'First name is required' })
        .min(1, 'Last name is required'),
    last_name: z
        .string({ required_error: 'Last name is required' })
        .min(1, 'Last name is required'),
    email: z
        .string({ required_error: 'Email is required' })
        .email('Email must be valid'),
    contact_number: z
        .string()
        .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
    description: z
        .string({ required_error: 'Message is required' })
        .min(20, 'Message must be at least 20 characters long')
        .max(100, 'Message must not exceed 100 characters'),
})
