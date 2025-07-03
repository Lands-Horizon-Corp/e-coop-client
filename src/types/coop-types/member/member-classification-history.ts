import { IAuditable, ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberClassification } from './member-classification'
import { IMemberProfile } from './member-profile'

// LATEST FROM ERD
export interface IMemberClassificationHistory extends ITimeStamps, IAuditable {
    id: TEntityId

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    member_classification_id: TEntityId
    member_classification?: IMemberClassification
}

export interface IMemberClassificationHistoryPaginated
    extends IPaginatedResult<IMemberClassificationHistory> {}
