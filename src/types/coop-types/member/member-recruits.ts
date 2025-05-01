import { ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'

// THIS does not exist on LATEST ERD
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
