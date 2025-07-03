import { IOrganization } from '@/types/lands-types'

import { IAuditable, ITimeStamps, TEntityId, TRelationship } from '../../common'
import { IBranch } from '../branch'
import { IMedia } from '../media'
import { IMemberProfile } from './member-profile'

// LATEST FROM ERD
export interface IMemberJointAccountRequest {
    id?: TEntityId

    member_profile_id: TEntityId

    picture_media_id: TEntityId
    signature_media_id: TEntityId

    branch_id?: TEntityId
    organization_id?: TEntityId

    description?: string

    first_name: string
    middle_name?: string
    last_name: string
    full_name: string
    suffix?: string
    birthday: string
    family_relationship: TRelationship
}

// LATEST FROM ERD
export interface IMemberJointAccount extends ITimeStamps, IAuditable {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    branch_id: TEntityId
    branch: IBranch

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    picture_media_id: TEntityId
    picture_media: IMedia

    signature_media_id: TEntityId
    signature_media: IMedia

    description?: string

    first_name: string
    middle_name?: string
    last_name: string
    full_name: string
    suffix?: string

    birthday: string
    family_relationship: TRelationship
}
