import { IBranch } from '../branch'
import { IMemberCenter } from './member-center'
import { IMemberProfile } from './member-profile'
import { IPaginatedResult } from '../paginated-result'
import { IAuditable, ITimeStamps, TEntityId } from '../../common'

// LATEST FROM ERD
export interface IMemberCenterHistory extends ITimeStamps, IAuditable {
    id: TEntityId

    member_center_id: TEntityId
    member_center: IMemberCenter

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    branch_id: TEntityId
    branch: IBranch
}

export interface IMemberCenterHistoryPaginated
    extends IPaginatedResult<IMemberCenterHistory> {}
