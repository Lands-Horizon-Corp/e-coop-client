import { IMediaResource } from '../media'
import { ITimeStamps, TEntityId } from '../common'
import { IMemberProfileResource } from './member-profile'

export interface IMemberGovernmentBenefitsRequest {
    id?: TEntityId
    country: string
    name: string
    description: string
    value: string
    frontMediaId?: TEntityId
    backMediaId?: TEntityId
}

export interface IMemberGovernmentBenefitsResource extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    country: string
    name: string
    description: string
    value: string
    frontMediaId?: TEntityId
    backMediaId?: TEntityId
    membersProfile?: IMemberProfileResource
    frontMedia?: IMediaResource
    backMedia?: IMediaResource
}
