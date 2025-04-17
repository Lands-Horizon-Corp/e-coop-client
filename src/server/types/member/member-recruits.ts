import { ITimeStamps, TEntityId } from '../common'
import { IMemberProfileResource } from './member-profile'

export interface IMemberRecruitsResource extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    membersProfileRecruitedId: TEntityId
    dateRecruited: string
    description: string
    name: string
    membersProfile?: IMemberProfileResource
    membersProfileRecruited?: IMemberProfileResource
}
