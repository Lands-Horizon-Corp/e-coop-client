import { ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'

export interface IMemberTypeRequest {
    name: string
    prefix: string
    description: string
}

export interface IMemberType extends ITimeStamps {
    id: TEntityId

    name: string
    description: string
    prefix: string
}

export interface IMemberTypePaginated extends IPaginatedResult<IMemberType> {}
