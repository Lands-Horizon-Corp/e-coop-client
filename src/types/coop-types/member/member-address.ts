import { ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'

export interface IMemberAddress extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    postalCode: string
    province: string
    city: string
    barangay: string
    label: string
    membersProfile?: IMemberProfile
}

export interface IMemberAddressRequest {
    id?: TEntityId
    postalCode: string
    province: string
    city: string
    barangay: string
    label: string
}
