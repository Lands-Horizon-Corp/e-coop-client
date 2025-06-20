import { IAuditable, ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'

// LATEST FROM ERD
export interface IMemberContactReferenceRequest {
    id?: TEntityId

    name: string
    description: string
    contact_number: string
}

// LATEST FROM ERD
export interface IMemberContactReference extends ITimeStamps, IAuditable {
    id: TEntityId

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    name: string
    description: string
    contact_number: string
}
