import z from 'zod'

import {
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '@/types/common'

import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberMutualFundHistoryRequest {
    member_profile_id: TEntityId
    title: string
    amount: number
    description?: string
}

export interface IMemberMutualFundHistoryResponse
    extends ITimeStamps,
        IOrgBranchIdentity {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    title: string
    amount: number
    description: string
}

export const memberMutualFundHistoryRequestSchema = z.object({
    member_profile_id: entityIdSchema,
    title: z.string().min(1).max(255),
    amount: z.number(),
    description: z.string().optional(),
})
