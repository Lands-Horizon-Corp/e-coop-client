import { IBranch } from '../branch'
import { IAuditable, IPaginatedResult, ITimeStamps, TEntityId } from '../common'

export interface IMemberOccupationRequest {
    name: string
    description: string

    // branch_id: TEntityId
}

export interface IMemberOccupation extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    name: string
    description: string
}

export interface IMemberOccupationPaginated
    extends IPaginatedResult<IMemberOccupation> {}
