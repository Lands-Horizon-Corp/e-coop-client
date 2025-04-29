import { ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberOccupationHistory } from './member-occupation-history'

export interface IMemberOccupationRequest {
    name: string
    description: string
}

export interface IMemberOccupation extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
    history?: IMemberOccupationHistory[]
}

export interface IMemberOccupationPaginated
    extends IPaginatedResult<IMemberOccupation> {}
