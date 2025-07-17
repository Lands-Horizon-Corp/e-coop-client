import {
    IAuditable,
    ITimeStamps,
    TAccountClosureReasonType,
    TEntityId,
} from '../../common'
import { IMemberProfile } from './member-profile'

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
