import { ITimeStamps, TEntityId } from '../common'
import { IMemberProfileResource } from './member-profile'

export interface IMemberAddressResource extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    postalCode: string
    province: string
    city: string
    barangay: string
    label: string
    membersProfile?: IMemberProfileResource
}

export interface IMemberAddressRequest {
    id?: TEntityId
    postalCode: string
    province: string
    city: string
    barangay: string
    label: string
}
