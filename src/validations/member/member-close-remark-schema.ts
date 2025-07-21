import z from 'zod'

import { AccountClosureReasons } from '@/constants'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'

export const memberCloseRemarkSchema = z.object({
    id: entityIdSchema.optional(),
    createdAt: z.string(),
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
