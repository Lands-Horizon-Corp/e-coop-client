import { IAuditable, ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'

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
