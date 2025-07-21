import z from 'zod'

import {
    civilStatusSchema,
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
    generalStatusSchema,
    stringDateSchema,
} from '../common'

// 📌 Identity & Personal Info
export const memberProfilePersonalInfoSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, 'Last name is required'),
    full_name: z.string().optional(),
    suffix: z.string().optional(),
    member_gender_id: entityIdSchema.optional(),
    birthdate: stringDateSchema.transform((val) => new Date(val).toISOString()),
    contact_number: z.string().optional(),

    civil_status: civilStatusSchema,

    member_occupation_id: entityIdSchema.optional(),

    business_address: z.string().optional(),
    business_contact_number: z.string().optional(),

    notes: z.string().optional(),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),

    media_id: entityIdSchema.optional(),
    media: z.any(), // JUST FOR SHOWING MEDIA IMAGE IN FORM
    signature_media_id: entityIdSchema.optional(),
    signature_media: z.any(), // JUST FOR SHOWING MEDIA IMAGE IN FORM
})

// 🏛️ Membership Info
export const memberProfileMembershipInfoSchema = z.object({
    passbook: z.string().optional(),
    old_reference_id: z.string().optional(),

    status: generalStatusSchema.optional(),

    member_type_id: entityIdSchema.optional(),
    member_group_id: entityIdSchema.optional(),
    member_classification_id: entityIdSchema.optional(),
    member_center_id: entityIdSchema.optional(),

    recruited_by_member_profile: z.any(),
    recruited_by_member_profile_id: entityIdSchema.optional(),

    is_mutual_fund_member: z.boolean().optional(),
    is_micro_finance_member: z.boolean().optional(),
})

// 👤 Account Info
export const memberProfileAccountSchema = z.object({
    user_id: entityIdSchema.optional(),
})
