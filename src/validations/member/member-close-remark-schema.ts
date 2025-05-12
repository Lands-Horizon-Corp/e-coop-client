import z from 'zod'
import { entityIdSchema } from '../common'
import { AccountClosureReasons } from '@/constants'

export const memberCloseRemarkSchema = z.object({
    id: entityIdSchema.optional(),
    created_at: z.string(),
    membersProfileId: entityIdSchema,
    description: z.string().min(1, 'Description/Reason is required'),
    category: z.enum(AccountClosureReasons).default('Inactive Membership'),
})

export const memberCreateCloseRemarkSchema = z.object({
    member_profile_id: entityIdSchema,
    reason: z.enum(AccountClosureReasons).default('Inactive Membership'),
    description: z.string().min(1, 'Description/Reason is required'),
})

export const memberCreateCloseRemarksSchema = z.object({
    remarks: z
        .array(memberCreateCloseRemarkSchema)
        .min(1, 'Atleast 1 close remark'),
})
