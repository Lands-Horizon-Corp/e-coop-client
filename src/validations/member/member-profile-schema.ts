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
    mediaSchema,
    middleNameSchema,
    passwordSchema,
    stringDateSchema,
    userNameSchema,
} from '../common'
import { memberAddressSchema } from './member-address-schema'
import { memberAssetsSchema } from './member-assets-schema'
import { memberCenterSchema } from './member-center-schema'
import { memberCloseRemarkSchema } from './member-close-remark-schema'
import { memberContactReferenceSchema } from './member-contact-number-references-schema'
import { memberDescriptionSchema } from './member-description-schema'
import { memberExpenseSchema } from './member-expense-schema'
import { memberGovernmentBenefitSchema } from './member-government-benefit'
import { memberIncomeSchema } from './member-income-schema'
import { memberJointAccountsSchema } from './member-joint-accounts-schema'
import { memberRelativeAccountsSchema } from './member-relative-accounts-schema'

export const createMemberProfileSchema = z.object({
    id: entityIdSchema.optional(),
    oldReferenceId: z.string().optional(),
    passbookNumber: z.string().optional(),

    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Lastname is required'),
    firstName: z.string().min(1, 'Firstname is required'),
    suffix: z.string().max(15).optional(),

    notes: z.string().min(1, 'Notes are required'),
    description: z.string().min(1, 'Description is required'),
    contactNumber: z.string().min(1, 'Contact number is required'),
    civilStatus: z
        .enum(['Married', 'Single', 'Widowed', 'Separated', 'N/A'])
        .default('Single'),
    occupationId: entityIdSchema.optional(),
    businessAddress: z.string().optional(),
    businessContact: z.string().optional(),

    status: z.enum(['Pending', 'Verified', 'Not Allowed']).default('Pending'),
    isClosed: z.boolean(),

    recruitedByMemberProfileId: entityIdSchema.optional(),
    recruitedByMemberProfile: z.any().optional(),

    isMutualFundMember: z.boolean().default(false),
    isMicroFinanceMember: z.boolean().default(false),

    memberCenterId: entityIdSchema.optional(),
    memberCenter: memberCenterSchema.optional(),

    mediaId: entityIdSchema.optional(),
    memberId: entityIdSchema.optional(),
    media: mediaSchema.optional(),

    signatureMediaId: entityIdSchema.optional(),
    signatureMedia: mediaSchema.optional(),

    memberTypeId: z
        .string()
        .min(1, 'Member Type is required')
        .uuid('Invalid member type'),
    branchId: entityIdSchema.optional(),
    memberGenderId: entityIdSchema.optional(),
    memberClassificationId: entityIdSchema.optional(),
    memberEducationalAttainmentId: entityIdSchema.optional(),

    member_addresses: z
        .array(memberAddressSchema)
        .min(1, 'Must provide at least 1 address'),

    memberContactNumberReferences: z
        .array(memberContactReferenceSchema)
        .min(1, 'Must provide at least 1 contact number'),

    memberIncome: z.array(memberIncomeSchema).optional(),
    memberAssets: z.array(memberAssetsSchema).optional(),
    memberExpenses: z.array(memberExpenseSchema).optional(),
    memberCloseRemarks: z.array(memberCloseRemarkSchema).optional(),
    memberDescriptions: z.array(memberDescriptionSchema).optional(),
    memberJointAccounts: z.array(memberJointAccountsSchema).optional(),
    memberGovernmentBenefitSchema: z
        .array(memberGovernmentBenefitSchema)
        .optional(),
    memberRelativeAccounts: z.array(memberRelativeAccountsSchema).optional(),
})

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
