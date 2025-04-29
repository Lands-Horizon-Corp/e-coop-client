import { TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberProfile } from './member-profile'
import { IMemberClassification } from './member-classification'

export interface IMemberClassificationHistory {
    id: TEntityId
    createdAt: string
    updatedAt: string
    deletedAt: string
    memberProfileId: TEntityId
    memberClassificationId: TEntityId
    memberProfile?: IMemberProfile
    memberClassification?: IMemberClassification
}

export interface IMemberClassificationHistoryPaginated
    extends IPaginatedResult<IMemberClassificationHistory> {}
