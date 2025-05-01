import { IBranch } from '../branch'
import { IMemberProfile } from './member-profile'
import { IAuditable, ITimeStamps, TEntityId, TRelationship } from '../../common'

// FROM LATEST ERD
export interface IMemberRelativeAccountsRequest {
    id?: TEntityId

    branch_id: TEntityId
    member_profile_id: TEntityId
    relative_member_profile_id: TEntityId

    family_relationship: TRelationship
    description: string
}

// FROM LATEST ERD
export interface IMemberRelativeAccounts extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    relative_member_profile_id: TEntityId
    relative_member_profile: IMemberProfile

    family_relationship: TRelationship
    description: string
}
