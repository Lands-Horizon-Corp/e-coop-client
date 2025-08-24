import {
    IAuditable,
    ITimeStamps,
    TAccountClosureReasonType,
    TEntityId,
} from '@/types/common'

import { IMemberProfile } from '../member-profile/member-profile.types'

// LATEST FROM ERD
export interface IMemberCloseRemarkRequest {
    id?: TEntityId
    member_profile_id: TEntityId

    reason: TAccountClosureReasonType
    description: string
}

// LATEST FROM ERD
export interface IMemberCloseRemark extends ITimeStamps, IAuditable {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    reason: TAccountClosureReasonType
    description: string
}
