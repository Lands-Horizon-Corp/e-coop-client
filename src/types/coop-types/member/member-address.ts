import { IMemberProfile } from './member-profile'
import { IAuditable, ITimeStamps, TEntityId } from '../../common'

// LATEST FROM ERD
export interface IMemberAddress extends ITimeStamps, IAuditable {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    label: string
    address: string
    country_code: string

    city?: string
    postal_code?: string
    province_state?: string
    barangay?: string
    landmark?: string
}

// LATEST FROM ERD
export interface IMemberAddressRequest {
    id?: TEntityId
    member_profile_id: TEntityId

    label: string
    address: string
    country_code: string

    city?: string
    postal_code?: string
    province_state?: string
    barangay?: string // Optional, specific to some countries
    landmark?: string // Optional, for additional directions
}
