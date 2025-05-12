import { IBranch } from '../branch'
import { IPaginatedResult } from '../paginated-result'
import { IAuditable, ITimeStamps, TEntityId } from '../../common'
// import { IMemberOccupationHistory } from './member-occupation-history'

// LATEST FROM ERD
export interface IMemberOccupationRequest {
    name: string
    description: string

    // branch_id: TEntityId
}

// LATEST FROM ERD
export interface IMemberOccupation extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    name: string
    description: string
    // history?: IMemberOccupationHistory[]
}

export interface IMemberOccupationPaginated
    extends IPaginatedResult<IMemberOccupation> {}
