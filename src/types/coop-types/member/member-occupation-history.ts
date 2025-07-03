import { IBaseEntityMeta, TEntityId } from '../../common'
import { IBranch } from '../branch'
import { IPaginatedResult } from '../paginated-result'
import { IMemberOccupation } from './member-occupation'
import { IMemberProfile } from './member-profile'

// LATEST FROM ERD
export interface IMemberOccupationHistory extends IBaseEntityMeta {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    member_occupation_id: TEntityId
    member_occupation: IMemberOccupation
}

export interface IMemberOccupationHistoryPaginated
    extends IPaginatedResult<IMemberOccupationHistory> {}
