import { IBranch } from '../branch'
import { IMemberProfile } from './member-profile'
import { IPaginatedResult } from '../paginated-result'
import { IMemberOccupation } from './member-occupation'

import { TEntityId, IBaseEntityMeta } from '../../common'

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
