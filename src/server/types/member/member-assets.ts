import { ITimeStamps, TEntityId } from '../common'
import { IMemberProfileResource } from './member-profile'

export interface IMemberAssetsRequest {
    id?: TEntityId
    membersProfileId?: TEntityId
    entryDate: string
    description: string
    name: string
    membersProfile?: IMemberProfileResource
}

export interface IMemberAssetsResource extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    entryDate: string
    description: string
    name: string
    membersProfile?: IMemberProfileResource
}
