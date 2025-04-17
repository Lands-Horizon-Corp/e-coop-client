import z from 'zod'
import { entityIdSchema } from '../common'
import { AccountClosureReasonTypes } from '@/server'

export const memberCloseRemarkSchema = z.object({
    id: entityIdSchema.optional(),
    createdAt: z.string(),
    membersProfileId: entityIdSchema,
    description: z.string().min(1, 'Description/Reason is required'),
    category: z.enum(AccountClosureReasonTypes).default('Inactive Membership'),
})

export const memberCreateCloseRemarkSchema = z.object({
    membersProfileId: entityIdSchema,
    description: z.string().min(1, 'Description/Reason is required'),
    category: z.enum(AccountClosureReasonTypes).default('Inactive Membership'),
})

export const memberCreateCloseRemarksSchema = z.object({
    remarks: z
        .array(memberCreateCloseRemarkSchema)
        .min(1, 'Atleast 1 close remark'),
})
