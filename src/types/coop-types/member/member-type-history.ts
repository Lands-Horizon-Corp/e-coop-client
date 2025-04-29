import { ITimeStamps, TEntityId } from '../../common'
import { IMemberType } from './member-type'
import { IPaginatedResult } from '../paginated-result'
import { IMemberProfile } from './member-profile'

export interface IMemberTypeHistory extends ITimeStamps {
    id: TEntityId
    memberProfileId: TEntityId
    memberTypeId: TEntityId
    memberProfile?: IMemberProfile
    memberType?: IMemberType
}

export interface IMemberTypeHistoryPaginated
    extends IPaginatedResult<IMemberTypeHistory> {}
