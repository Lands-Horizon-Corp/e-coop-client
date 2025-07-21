import z from 'zod'

import { isBefore, startOfDay } from 'date-fns'

import {
    civilStatusSchema,
    contactNumberSchema,
    emailSchema,
    entityIdSchema,
    firstNameSchema,
    generalStatusSchema,
    lastNameSchema,
    middleNameSchema,
    passwordSchema,
    stringDateSchema,
    userNameSchema,
} from '../common'

export const withNewUserAccountSchema = z.discriminatedUnion(
    'create_new_user',
    [
        z.object({
            create_new_user: z.literal(false),
        }),
        z.object({
            create_new_user: z.literal(true),
            new_user_info: z
                .object({
                    user_name: z.string(),
                    email: emailSchema,
                    password: passwordSchema,
                })
                .optional(),
        }),
    ]
)

export const quickCreateMemberProfileSchema = z
    .object({
        old_reference_id: z.string().optional(),
        passbook: z.string().optional(),

        organization_id: entityIdSchema.optional(),
        branch_id: entityIdSchema.optional(),

        first_name: z.string().min(1, 'First name is required'),
        middle_name: z.string().optional(),
        last_name: z.string().min(1, 'Last name is required'),
        full_name: z.string().optional(),
        suffix: z.string().max(15).optional(),
        contact_number: z.string().optional(),
        birthdate: stringDateSchema
            .refine(
                (val) => {
                    const date = startOfDay(new Date(val))
                    const now = startOfDay(new Date())
                    return isBefore(date, now)
                },
                { message: 'Birthdate must be in the past' }
            )
            .transform((val) => new Date(val).toISOString()),
        member_gender_id: entityIdSchema.optional(),

        civil_status: civilStatusSchema,
        occupation_id: entityIdSchema.optional(),

        status: generalStatusSchema.default('verified'),

        is_mutual_fund_member: z.boolean().default(false),
        is_micro_finance_member: z.boolean().default(false),

        member_type_id: entityIdSchema,
    })
    .and(withNewUserAccountSchema)

export const withPassword = z.discriminatedUnion('with_password', [
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

export const memberProfileUserAccountSchema = z
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
    .and(withPassword)

// export const quickCreateMemberProfileSchema = z.object({
//     old_reference_id: z.string().optional(),
//     passbook: z.string().optional(),

//     organization_id: entityIdSchema.optional(),
//     branch_id: entityIdSchema.optional(),

//     first_name: z.string().min(1, 'First name is required'),
//     middle_name: z.string().optional(),
//     last_name: z.string().min(1, 'Last name is required'),
//     full_name: z.string().optional(),
//     suffix: z.string().max(15).optional(),
//     contact_number: z.string().optional(),
//     birthdate: stringDateSchema.transform((val) =>
//         new Date(val).toISOString()
//     ),
//     member_gender_id: entityIdSchema.optional(),

//     civil_status: civilStatusSchema,
//     occupation_id: entityIdSchema.optional(),

//     status: generalStatusSchema.default('verified'),

//     is_mutual_fund_member: z.boolean().default(false),
//     is_micro_finance_member: z.boolean().default(false),

//     member_type_id: entityIdSchema,

//     // FOR create
//     create_new_user: z.boolean().optional(),
//     new_user_info: z
//         .object({
//             user_name: z.string(),
//             email: emailSchema,
//             password: passwordSchema,
//         })
//         .optional(),
// })
