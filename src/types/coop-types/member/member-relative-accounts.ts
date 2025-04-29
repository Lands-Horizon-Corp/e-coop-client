import { IMemberProfile } from './member-profile'
import { ITimeStamps, TEntityId, TRelationship } from '../../common'

export interface IMemberRelativeAccountsRequest {
    id?: TEntityId
    membersProfileId?: TEntityId
    relativeProfileMemberId: TEntityId
    familyRelationship: string
    description: string
    memberProfile?: IMemberProfile
    relativeProfileMemberProfile?: IMemberProfile
}

export interface IMemberRelativeAccounts extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    relativeProfileMemberId: TEntityId
    familyRelationship: TRelationship
    description: string
    memberProfile?: IMemberProfile
    relativeProfileMemberProfile?: IMemberProfile
}
