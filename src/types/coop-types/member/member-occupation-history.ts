import { IBranch } from '../branch'
import { IMemberProfile } from './member-profile'
import { IAuditable, ITimeStamps, TEntityId } from '../../common'
import { IMemberOccupation } from './member-occupation'

// LATEST FROM ERD
export interface IMemberOccupationHistory extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    member_occupation_id: TEntityId
    member_occupation: IMemberOccupation
}
