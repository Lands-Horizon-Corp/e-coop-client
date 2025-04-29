import { ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'

export interface IMemberDescriptionRequest {
    id?: TEntityId
    name: string
    description: string
}

export interface IMemberDescription extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    date: string
    description: string
    name: string
    membersProfile?: IMemberProfile
}
