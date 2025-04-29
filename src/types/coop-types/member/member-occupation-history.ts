import { ITimeStamps, TEntityId } from '../common'
import { IMemberProfileResource } from './member-profile'
import { IMemberOccupationResource } from './member-occupation'

export interface IMemberOccupationHistoryResource extends ITimeStamps {
    id: TEntityId
    memberProfileId: TEntityId
    memberOccupationId: TEntityId
    memberProfile?: IMemberProfileResource
    memberOccupation?: IMemberOccupationResource
}
