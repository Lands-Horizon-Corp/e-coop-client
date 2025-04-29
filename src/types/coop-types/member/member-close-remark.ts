import { IMemberProfile } from './member-profile'
import { TAccountClosureReasonType, ITimeStamps, TEntityId } from '../../common'

export interface IMemberCloseRemarkRequest {
    id?: TEntityId
    category: TAccountClosureReasonType
    membersProfileId: TEntityId
    description: string
}

export interface IMemberCloseRemark extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    category: TAccountClosureReasonType
    description: string
    membersProfile?: IMemberProfile
}
