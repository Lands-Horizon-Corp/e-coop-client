import { IMedia } from '../media'
import { ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'

export interface IMemberJointAccountsRequest {
    id?: TEntityId

    lastName: string
    middleName?: string
    firstName: string
    suffix?: string

    description: string
    familyRelationship?: string
    membersProfileId?: TEntityId
    membersProfile?: IMemberProfile

    mediaId?: TEntityId
    media?: IMedia
    signatureMediaId?: TEntityId
    signatureMedia?: IMedia
}

export interface IMemberJointAccounts extends ITimeStamps {
    id: TEntityId

    lastName: string
    middleName?: string
    firstName: string
    suffix?: string

    description: string
    familyRelationship?: string
    membersProfileId: TEntityId
    membersProfile: IMemberProfile

    mediaId?: TEntityId
    media?: IMedia
    signatureMediaId?: TEntityId
    signatureMedia?: IMedia
}
