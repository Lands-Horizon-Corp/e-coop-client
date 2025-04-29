import { ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from './paginated-result'

export interface IGenderRequest {
    name: string
    description?: string
}

export interface IGender extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
}

export interface IGenderPaginated extends IPaginatedResult<IGender> {}
