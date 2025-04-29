import { ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberOccupationHistoryResource } from './member-occupation-history'

export interface IMemberOccupationRequest {
    name: string
    description: string
}

export interface IMemberOccupationResource extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
    history?: IMemberOccupationHistoryResource[]
}

export interface IMemberOccupationPaginatedResource
    extends IPaginatedResult<IMemberOccupationResource> {}
