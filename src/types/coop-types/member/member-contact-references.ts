import { IAuditable, ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'

// LATEST FROM ERD
export interface IMemberContactReferenceRequest {
    id?: TEntityId

    name: string
    description: string
    contactNumber: string
}

// LATEST FROM ERD
export interface IMemberContactReferences extends ITimeStamps, IAuditable {
    id: TEntityId

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    name: string
    description: string
    contactNumber: string
}
