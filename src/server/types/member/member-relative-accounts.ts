import { IMemberProfileResource } from './member-profile'
import { ITimeStamps, TEntityId, TRelationship } from '../common'

export interface IMemberRelativeAccountsRequest {
    id?: TEntityId
    membersProfileId?: TEntityId
    relativeProfileMemberId: TEntityId
    familyRelationship: string
    description: string
    memberProfile?: IMemberProfileResource
    relativeProfileMemberProfile?: IMemberProfileResource
}

export interface IMemberRelativeAccountsResource extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    relativeProfileMemberId: TEntityId
    familyRelationship: TRelationship
    description: string
    memberProfile?: IMemberProfileResource
    relativeProfileMemberProfile?: IMemberProfileResource
}
