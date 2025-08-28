import z from 'zod'

import {
    contactNumberSchema,
    emailSchema,
    firstNameSchema,
    lastNameSchema,
    middleNameSchema,
    passwordSchema,
    stringDateSchema,
    userNameSchema,
} from '@/validation'
import { isBefore, startOfDay } from 'date-fns'

export const WithPassword = z.discriminatedUnion('with_password', [
    z.object({
        with_password: z.literal(false),
        password: z.preprocess(
            (val) =>
                typeof val === 'string' && val.length === 0 ? undefined : val,
            passwordSchema.optional()
        ),
    }),
    z.object({ with_password: z.literal(true), password: passwordSchema }),
])

export const MemberProfileUserAccountSchema = z
    .object({
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
    })
    .and(WithPassword)
