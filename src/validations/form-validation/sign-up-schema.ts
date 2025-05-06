import z from 'zod'

import {
    emailSchema,
    passwordSchema,
    lastNameSchema,
    userNameSchema,
    firstNameSchema,
    birthDateSchema,
    middleNameSchema,
    contactNumberSchema,
} from '@/validations/common'

export const signUpSchema = z.object({
    email: emailSchema,
    user_name: userNameSchema,
    first_name: firstNameSchema,
    middle_name: middleNameSchema,
    last_name: lastNameSchema,
    full_name: z.string().min(1, 'full name is required'),
    suffix: z.string().optional(),

    birthdate: birthDateSchema,
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
