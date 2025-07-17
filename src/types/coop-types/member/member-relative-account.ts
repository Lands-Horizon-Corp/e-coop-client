import { IOrganization } from '@/types/lands-types'

import { IAuditable, ITimeStamps, TEntityId, TRelationship } from '../../common'
import { IBranch } from '../branch'
import { IMemberProfile } from './member-profile'

// FROM LATEST ERD
export interface IMemberRelativeAccountRequest {
    id?: TEntityId

    branch_id?: TEntityId
    organization_id?: TEntityId

    member_profile_id: TEntityId
    relative_member_profile_id: TEntityId

    family_relationship: TRelationship
    description?: string
}

// FROM LATEST ERD
export interface IMemberRelativeAccount extends ITimeStamps, IAuditable {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    branch_id: TEntityId
    branch: IBranch

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    relative_member_profile_id: TEntityId
    relative_member_profile: IMemberProfile

    family_relationship: TRelationship
    description: string
}
