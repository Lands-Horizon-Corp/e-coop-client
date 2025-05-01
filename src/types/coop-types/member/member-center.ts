import { IPaginatedResult } from '../paginated-result'
import { ITimeStamps, TEntityId, IAuditable } from '../../common'

// LATEST FROM ERD
export interface IMemberCenterRequest {
    id?: TEntityId
    name: string
    description: string
}

// LATEST FROM ERD
export interface IMemberCenter extends ITimeStamps, IAuditable {
    id: TEntityId

    name: string
    description: string
}

export interface IMemberCenterPaginated
    extends IPaginatedResult<IMemberCenter> {}
