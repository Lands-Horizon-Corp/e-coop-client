import { IAuditable, ITimeStamps, TEntityId } from '../../common'
import { IBranch } from '../branch'
import { IPaginatedResult } from '../paginated-result'
import { IMemberGender } from './member-gender'
import { IMemberProfile } from './member-profile'

// LATEST FROM ERD
export interface IMemberGenderHistory extends ITimeStamps, IAuditable {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    member_gender_id: TEntityId
    member_gender: IMemberGender

    branch_id: TEntityId
    branch: IBranch
}

export interface IMemberGenderHistoryPaginated
    extends IPaginatedResult<IMemberGenderHistory> {}
