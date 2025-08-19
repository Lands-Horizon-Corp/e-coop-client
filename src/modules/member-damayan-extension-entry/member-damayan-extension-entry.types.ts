import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '@/types/common'

import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberDamayanExtensionEntryRequest {
    member_profile_id: TEntityId
    name: string
    description?: string
    birthdate?: string
}

export interface IMemberDamayanExtensionEntryResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    name: string
    description: string
    birthdate?: string
}

export const memberDamayanExtensionEntryRequestSchema = z.object({
    member_profile_id: entityIdSchema,
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    birthdate: z.string().datetime().optional(),
})
