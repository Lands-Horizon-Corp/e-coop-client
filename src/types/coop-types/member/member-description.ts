import { ITimeStamps, TEntityId } from '../common'
import { IMemberProfileResource } from './member-profile'

export interface IMemberDescriptionRequest {
    id?: TEntityId
    name: string
    description: string
}

export interface IMemberDescriptionResource extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    date: string
    description: string
    name: string
    membersProfile?: IMemberProfileResource
}
