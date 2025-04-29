import { ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'
import { IMemberOccupation } from './member-occupation'

export interface IMemberOccupationHistory extends ITimeStamps {
    id: TEntityId
    memberProfileId: TEntityId
    memberOccupationId: TEntityId
    memberProfile?: IMemberProfile
    memberOccupation?: IMemberOccupation
}
