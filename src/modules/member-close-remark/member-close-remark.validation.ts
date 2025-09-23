import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

import { ACCOUNT_CLOSURE_REASONS } from './member-close-remark.constants'

export const MemberCloseRemarkSchema = z.object({
    id: entityIdSchema.optional(),
    created_at: z.string(),
    membersProfileId: entityIdSchema,
    description: descriptionSchema
        .min(1, 'Description/Reason is required')
        .transform(descriptionTransformerSanitizer),
    category: z.enum(ACCOUNT_CLOSURE_REASONS).default('Inactive Membership'),
})

export const MemberCreateCloseRemarkSchema = z.object({
    member_profile_id: entityIdSchema,
    reason: z.enum(ACCOUNT_CLOSURE_REASONS).default('Inactive Membership'),
    description: descriptionSchema
        .min(1, 'Description/Reason is required')
        .transform(descriptionTransformerSanitizer),
})

export const MemberCreateCloseRemarksSchema = z.object({
    remarks: z
        .array(MemberCreateCloseRemarkSchema)
        .min(1, 'Atleast 1 close remark'),
})
