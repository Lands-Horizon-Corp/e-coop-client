import { IMemberProfile } from './member-profile'
import { ITimeStamps, TEntityId } from '../../common'

export interface IMemberRecruitedMembers extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    membersProfileRecruitedId: TEntityId
    dateRecruited: string
    description: string
    name: string
    membersProfile: IMemberProfile
    membersProfileRecruited: IMemberProfile
}
