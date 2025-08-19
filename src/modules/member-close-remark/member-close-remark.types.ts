import z from 'zod'

import { AccountClosureReasons } from '@/constants'
import {
    IAuditable,
    ITimeStamps,
    TAccountClosureReasonType,
    TEntityId,
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/types/common'

import { IMemberProfile } from '../member-profile/member-profile.types'

// LATEST FROM ERD
export interface IMemberCloseRemarkRequest {
    id?: TEntityId
    member_profile_id: TEntityId

    reason: TAccountClosureReasonType
    description: string
}

// LATEST FROM ERD
export interface IMemberCloseRemark extends ITimeStamps, IAuditable {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    reason: TAccountClosureReasonType
    description: string
}

export const memberCloseRemarkSchema = z.object({
    id: entityIdSchema.optional(),
    created_at: z.string(),
    membersProfileId: entityIdSchema,
    description: descriptionSchema
        .min(1, 'Description/Reason is required')
        .transform(descriptionTransformerSanitizer),
    category: z.enum(AccountClosureReasons).default('Inactive Membership'),
})

export const memberCreateCloseRemarkSchema = z.object({
    member_profile_id: entityIdSchema,
    reason: z.enum(AccountClosureReasons).default('Inactive Membership'),
    description: descriptionSchema
        .min(1, 'Description/Reason is required')
        .transform(descriptionTransformerSanitizer),
})

export const memberCreateCloseRemarksSchema = z.object({
    remarks: z
        .array(memberCreateCloseRemarkSchema)
        .min(1, 'Atleast 1 close remark'),
})
