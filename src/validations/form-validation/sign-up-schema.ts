import z from 'zod'

import { isBefore, startOfDay } from 'date-fns'

import {
    contactNumberSchema,
    emailSchema,
    firstNameSchema,
    lastNameSchema,
    middleNameSchema,
    passwordSchema,
    stringDateSchema,
    userNameSchema,
} from '@/validations/common'

export const signUpSchema = z.object({
    email: emailSchema,
    user_name: userNameSchema,
    first_name: firstNameSchema,
    middle_name: middleNameSchema,
    last_name: lastNameSchema,
    full_name: z.string().min(1, 'full name is required'),
    suffix: z.string().optional(),

    birthdate: stringDateSchema.refine(
        (val) => {
            const date = startOfDay(new Date(val))
            const now = startOfDay(new Date())
            return isBefore(date, now)
        },
        { message: 'Birthdate must be in the past' }
    ),

    contact_number: contactNumberSchema,
    password: passwordSchema,

    accept_terms: z
        .boolean()
        .default(false)
        .refine(
            (val) => {
                return val === true
            },
            {
                message: 'You must accept the terms and conditions',
            }
        ),
})
