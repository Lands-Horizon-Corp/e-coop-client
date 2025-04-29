import { IMedia } from '../media'
import { ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'

export interface IMemberGovernmentBenefitsRequest {
    id?: TEntityId
    country: string
    name: string
    description: string
    value: string
    frontMediaId?: TEntityId
    backMediaId?: TEntityId
}

export interface IMemberGovernmentBenefits extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    country: string
    name: string
    description: string
    value: string
    frontMediaId?: TEntityId
    backMediaId?: TEntityId
    membersProfile?: IMemberProfile
    frontMedia?: IMedia
    backMedia?: IMedia
}
