import { IAuditable, ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'

export interface IMemberDescriptionRequest {
    id?: TEntityId
    name: string
    description: string
}

// IDK if this will be removed, not existing on LATEST ERD
export interface IMemberDescription extends ITimeStamps, IAuditable {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    date: string
    description: string
    name: string
}
