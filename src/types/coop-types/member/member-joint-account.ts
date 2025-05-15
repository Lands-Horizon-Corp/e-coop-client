import { IMedia } from '../media'
import { IBranch } from '../branch'
import { IMemberProfile } from './member-profile'
import { IAuditable, ITimeStamps, TEntityId, TRelationship } from '../../common'

// LATEST FROM ERD
export interface IMemberJointAccountRequest {
    id?: TEntityId

    branch_id: TEntityId
    picture_media_id: TEntityId
    member_profile_id: TEntityId
    signature_media_id: TEntityId

    description: string

    first_name: string
    middle_name?: string
    last_name: string
    suffix?: string

    birthday: string
    family_relationship: TRelationship
}

// LATEST FROM ERD
export interface IMemberJointAccount extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    picture_media_id: TEntityId
    picture_media: IMedia

    signature_media_id: TEntityId
    signature_media: IMedia

    description: string

    first_name: string
    middle_name?: string
    last_name: string
    suffix?: string

    birthday: string
    family_relationship: TRelationship
}
