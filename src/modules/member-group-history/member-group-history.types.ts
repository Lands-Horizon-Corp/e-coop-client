import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '@/types/common'

import { IMemberGroup } from '../member-group/member-group.types'
import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberGroupHistoryRequest {
    member_profile_id: TEntityId
    member_group_id: TEntityId
}

export interface IMemberGroupHistoryResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    member_group_id: TEntityId
    member_group?: IMemberGroup
}

export const memberGroupHistoryRequestSchema = z.object({
    member_profile_id: entityIdSchema,
    member_group_id: entityIdSchema,
})
