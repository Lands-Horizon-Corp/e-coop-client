import { IAuditable, ITimeStamps, TEntityId } from '../../common'
import { IBranch } from '../branch'
import { IPaginatedResult } from '../paginated-result'
import { IMemberProfile } from './member-profile'
import { IMemberType } from './member-type'

// FROM LATEST ERD
export interface IMemberTypeHistory extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    member_type_id: TEntityId
    member_type: IMemberType

    member_profile_id: TEntityId
    member_profile: IMemberProfile
}

export interface IMemberTypeHistoryPaginated
    extends IPaginatedResult<IMemberTypeHistory> {}
