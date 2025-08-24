import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

import { IMemberGroup } from '../member-group/member-group.types'
import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberGroupHistoryRequest {
    member_profile_id: TEntityId
    member_group_id: TEntityId
}

export interface IMemberGroupHistory extends IBaseEntityMeta {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    member_group_id: TEntityId
    member_group?: IMemberGroup
}

export interface IMemberGroupHistoryPaginated
    extends IPaginatedResult<IMemberGroupHistory> {}
