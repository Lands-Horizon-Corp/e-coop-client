import { IAuditable, ITimeStamps, TEntityId } from '../../common'
import { IBranch } from '../branch'
import { IMedia } from '../media'
import { IMemberProfile } from './member-profile'

// LATEST FROM ERD
export interface IMemberAssetRequest {
    id?: TEntityId
    media_id?: TEntityId

    member_profile_id: TEntityId

    branch_id?: TEntityId

    name: string
    entry_date: string
    description: string
    cost: number
}

// LATEST FROM ERD
export interface IMemberAsset extends ITimeStamps, IAuditable {
    id: TEntityId
    media_id?: TEntityId
    media?: IMedia

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    branch_id: TEntityId
    branch: IBranch

    name: string
    entry_date: string
    description: string
    cost: number
}
