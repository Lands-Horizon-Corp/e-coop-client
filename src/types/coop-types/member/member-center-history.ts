import { ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberCenter } from './member-center'
import { IMemberProfile } from './member-profile'

export interface IMemberCenterHistory extends ITimeStamps {
    id: TEntityId
    memberProfileId: TEntityId
    memberCenterId: TEntityId
    memberProfile?: IMemberProfile
    memberCenter?: IMemberCenter
}

export interface IMemberCenterHistoryPaginated
    extends IPaginatedResult<IMemberCenterHistory> {}
