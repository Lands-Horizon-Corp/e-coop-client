import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '@/types/common'

import { IMemberOccupation } from '../member-occupation/member-occupation.types'
import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberOccupationHistoryRequest {
    member_profile_id: TEntityId
    member_occupation_id: TEntityId
}

export interface IMemberOccupationHistoryResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    member_occupation_id: TEntityId
    member_occupation?: IMemberOccupation
}

export const memberOccupationHistoryRequestSchema = z.object({
    member_profile_id: entityIdSchema,
    member_occupation_id: entityIdSchema,
})
