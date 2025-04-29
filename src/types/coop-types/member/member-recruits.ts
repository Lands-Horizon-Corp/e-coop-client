import { ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'

export interface IMemberRecruits extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    membersProfileRecruitedId: TEntityId
    dateRecruited: string
    description: string
    name: string
    membersProfile?: IMemberProfile
    membersProfileRecruited?: IMemberProfile
}
