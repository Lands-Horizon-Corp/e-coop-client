import {
    IAuditable,
    IOrgBranchIdentity,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IMemberClassification } from '../member-classification/member-classification.types'
import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberClassificationHistoryRequest {
    member_classification_id: TEntityId
    member_profile_id: TEntityId
    branch_id: TEntityId
    organization_id: TEntityId
}

export interface IMemberClassificationHistory
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_classification_id: TEntityId
    member_classification?: IMemberClassification
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
}

export interface IMemberClassificationHistoryPaginated
    extends IPaginatedResult<IMemberClassificationHistory> {}
e
