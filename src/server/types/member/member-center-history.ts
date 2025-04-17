import { ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberCenterResource } from './member-center'
import { IMemberProfileResource } from './member-profile'

export interface IMemberCenterHistoryResource extends ITimeStamps {
    id: TEntityId
    memberProfileId: TEntityId
    memberCenterId: TEntityId
    memberProfile?: IMemberProfileResource
    memberCenter?: IMemberCenterResource
}

export interface IMemberCenterHistoryPaginatedResource
    extends IPaginatedResult<IMemberCenterHistoryResource> {}
