import { IMemberProfile } from './member-profile'
import { ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberEducationalAttainment } from './member-educational-attainment'

// This does not exist on LATEST ERD
export interface IMemberEducationalAttainmentHistory extends ITimeStamps {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    member_educational_attainment_id: TEntityId
    member_educational_attainment: IMemberEducationalAttainment
}

export interface IMemberEducationalAttainmentHistoryPaginated
    extends IPaginatedResult<IMemberEducationalAttainmentHistory> {}
