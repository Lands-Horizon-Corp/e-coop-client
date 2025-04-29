import { ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberProfileResource } from './member-profile'
import { IMemberEducationalAttainmentResource } from './member-educational-attainment'

export interface IMemberEducationalAttainmentHistoryResource
    extends ITimeStamps {
    id: TEntityId
    memberProfileId: TEntityId
    memberEducationalAttainmentId: TEntityId
    memberProfile?: IMemberProfileResource
    memberEducationalAttainment?: IMemberEducationalAttainmentResource
}

export interface IMemberEducationalAttainmentHistoryPaginatedResource
    extends IPaginatedResult<IMemberEducationalAttainmentHistoryResource> {}
