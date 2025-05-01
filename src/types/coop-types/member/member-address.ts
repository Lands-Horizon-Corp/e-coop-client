import { IMemberProfile } from './member-profile'
import { IAuditable, ITimeStamps, TEntityId } from '../../common'

// LATEST FROM ERD
export interface IMemberAddress extends ITimeStamps, IAuditable {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    label: string
    city: string
    country_code: string
    postal_code: string
    province_state: string
    barangay: string

    landmark: string
    address: string
}

// LATEST FROM ERD
export interface IMemberAddressRequest {
    id?: TEntityId
    member_profile_id: TEntityId

    label: string
    city: string
    country_code: string
    postal_code: string
    province_state: string
    barangay: string

    landmark: string
    address: string
}
