import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IBranch } from '../branch/branch.types'
import { IMemberProfile } from '../member-profile/member-profile.types'
import { IMemberType } from '../member-type/member-type.types'

// FROM LATEST ERD
export interface IMemberTypeHistory extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    member_type_id: TEntityId
    member_type: IMemberType

    member_profile_id: TEntityId
    member_profile: IMemberProfile
}

export interface IMemberTypeHistoryPaginated
    extends IPaginatedResult<IMemberTypeHistory> {}
