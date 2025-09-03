import z from 'zod'

import {
    birthDateSchema,
    civilStatusSchema,
    contactNumberSchema,
    dateToISOTransformer,
    descriptionTransformerSanitizer,
    emailSchema,
    entityIdSchema,
    firstNameSchema,
    generalStatusSchema,
    lastNameSchema,
    middleNameSchema,
    passwordSchema,
    permanentAddressSchema,
    stringDateSchema,
    userNameSchema,
} from '@/validation'
import { isBefore, startOfDay } from 'date-fns'

export const BaseMemberAccountSchema = z.object({
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

export const CreateMemberAccountSchema = BaseMemberAccountSchema.extend({
    mode: z.literal('create'),
    password: passwordSchema,
    confirmPassword: passwordSchema,
})

export const UpdateMemberAccountSchema = BaseMemberAccountSchema.extend({
    mode: z.literal('update'),
    id: entityIdSchema.optional(),
    password: passwordSchema.optional(),
    confirmPassword: passwordSchema.optional(),
})

export const MemberCreateUpdateAccountSchema = z
    .discriminatedUnion('mode', [
        CreateMemberAccountSchema,
        UpdateMemberAccountSchema,
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

export const WithNewUserAccountSchema = z.discriminatedUnion(
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

export const QuickCreateMemberProfileSchema = z
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

        member_type_id: entityIdSchema.optional(),
    })
    .and(WithNewUserAccountSchema)

export type TQuickCreateMemberProfileSchema = z.infer<
    typeof QuickCreateMemberProfileSchema
>

// 📌 Identity & Personal Info
export const MemberProfilePersonalInfoSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, 'Last name is required'),
    full_name: z.string().optional(),
    suffix: z.string().optional(),
    member_gender_id: entityIdSchema.optional(),
    birthdate: stringDateSchema.transform(dateToISOTransformer),
    contact_number: z.string().optional(),

    civil_status: civilStatusSchema,

    member_occupation_id: entityIdSchema.optional(),

    business_address: z.string().optional(),
    business_contact_number: z.string().optional(),

    notes: z.string().optional(),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),

    media_id: entityIdSchema.optional(),
    media: z.any(), // JUST FOR SHOWING MEDIA IMAGE IN FORM
    signature_media_id: entityIdSchema.optional(),
    signature_media: z.any(), // JUST FOR SHOWING MEDIA IMAGE IN FORM
})

// 🏛️ Membership Info
export const MemberProfileMembershipInfoSchema = z.object({
    passbook: z.string().optional(),
    old_reference_id: z.string().optional(),

    status: generalStatusSchema.optional(),

    member_department_id: entityIdSchema.optional(),
    member_type_id: entityIdSchema.optional(),
    member_group_id: entityIdSchema.optional(),
    member_classification_id: entityIdSchema.optional(),
    member_center_id: entityIdSchema.optional(),

    recruited_by_member_profile: z.any(),
    recruited_by_member_profile_id: entityIdSchema.optional(),

    is_mutual_fund_member: z.boolean().optional(),
    is_micro_finance_member: z.boolean().optional(),
})

export type TMemberProfileMembershipInfoSchema = z.infer<
    typeof MemberProfileMembershipInfoSchema
>

// 👤 Account Info
export const MemberProfileAccountSchema = z.object({
    user_id: entityIdSchema.optional(),
})
