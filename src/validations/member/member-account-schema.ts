import z from 'zod'

import {
    birthDateSchema,
    contactNumberSchema,
    emailSchema,
    entityIdSchema,
    firstNameSchema,
    lastNameSchema,
    middleNameSchema,
    passwordSchema,
    permanentAddressSchema,
    userNameSchema,
} from '../common'

export const baseMemberAccountSchema = z.object({
    id: entityIdSchema.optional(),
    email: emailSchema,
    username: userNameSchema,
    firstName: firstNameSchema,
    middleName: middleNameSchema.optional(),
    lastName: lastNameSchema,
    birthDate: birthDateSchema,
    companyId: entityIdSchema,
    contactNumber: contactNumberSchema,
    permanentAddress: permanentAddressSchema,
})

export const createMemberAccountSchema = baseMemberAccountSchema.extend({
    mode: z.literal('create'),
    password: passwordSchema,
    confirmPassword: passwordSchema,
})

export const updateMemberAccountSchema = baseMemberAccountSchema.extend({
    mode: z.literal('update'),
    id: entityIdSchema.optional(),
    password: passwordSchema.optional(),
    confirmPassword: passwordSchema.optional(),
})

export const memberCreateUpdateAccountSchema = z
    .discriminatedUnion('mode', [
        createMemberAccountSchema,
        updateMemberAccountSchema,
    ])
    .superRefine((data, ctx) => {
        if (data.password || data.confirmPassword) {
            if (data.password !== data.confirmPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['confirmPassword'],
                    message: 'Passwords do not match.',
                })
            }
        }
    })
