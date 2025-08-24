import {
    IAuditable,
    IOrgBranchIdentity,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IMemberOccupation } from '../member-occupation/member-occupation.types'
import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberOccupationHistoryRequest {
    member_profile_id: TEntityId
    member_occupation_id: TEntityId
}

export interface IMemberOccupationHistory
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    member_occupation_id: TEntityId
    member_occupation?: IMemberOccupation
}

export interface IMemberOccupationHistoryPaginated
    extends IPaginatedResult<IMemberOccupationHistory> {}
