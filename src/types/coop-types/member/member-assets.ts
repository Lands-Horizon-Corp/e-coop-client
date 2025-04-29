import { ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'

export interface IMemberAssetsRequest {
    id?: TEntityId
    membersProfileId?: TEntityId
    entryDate: string
    description: string
    name: string
    membersProfile?: IMemberProfile
}

export interface IMemberAssets extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    entryDate: string
    description: string
    name: string
    membersProfile?: IMemberProfile
}
