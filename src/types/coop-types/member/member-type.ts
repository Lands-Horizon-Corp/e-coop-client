import { IBranch } from '../branch'
import { IPaginatedResult } from '../paginated-result'
import { IAuditable, ITimeStamps, TEntityId } from '../../common'

export interface IMemberTypeRequest {
    id?: TEntityId
    branch_id: IBranch // IDK if this should be optional

    name: string
    prefix: string
    description: string
}

export interface IMemberType extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    name: string
    prefix: string
    description: string
}

export interface IMemberTypePaginated extends IPaginatedResult<IMemberType> {}
