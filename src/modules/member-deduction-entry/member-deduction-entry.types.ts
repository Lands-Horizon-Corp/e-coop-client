import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'
import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

import { IAccount } from '../account'
import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberDeductionEntryRequest {
    member_profile_id: TEntityId
    account_id: TEntityId
    name?: string
    description?: string
    membership_date?: string
}

export interface IMemberDeductionEntryResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    account_id: TEntityId
    account?: IAccount
    name: string
    description: string
    membership_date: string
}

export const memberDeductionEntryRequestSchema = z.object({
    member_profile_id: entityIdSchema,
    account_id: entityIdSchema,
    name: z.string().optional(),
    description: z.string().optional(),
    membership_date: z.string().datetime().optional(),
})

export const TMemberDepartmentSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Department name is required'),
    description: z.coerce
        .string()
        .min(15, 'Department Description is required')
        .optional()
        .transform(descriptionTransformerSanitizer),
    icon: z.string().optional(),
})
