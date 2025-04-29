import { ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberProfile } from './member-profile'
import { IMemberEducationalAttainment } from './member-educational-attainment'

export interface IMemberEducationalAttainmentHistory extends ITimeStamps {
    id: TEntityId
    memberProfileId: TEntityId
    memberEducationalAttainmentId: TEntityId
    memberProfile?: IMemberProfile
    memberEducationalAttainment?: IMemberEducationalAttainment
}

export interface IMemberEducationalAttainmentHistoryPaginated
    extends IPaginatedResult<IMemberEducationalAttainmentHistory> {}
