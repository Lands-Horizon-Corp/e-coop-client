import { IBaseEntityMeta, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberGroup } from './member-group'
import { IMemberProfile } from './member-profile'

export interface IMemberGroupHistory extends IBaseEntityMeta {
    id: TEntityId

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    member_group_id: TEntityId
    member_group: IMemberGroup
}

export interface IMemberGroupHistoryPaginated
    extends IPaginatedResult<IMemberGroupHistory> {}
