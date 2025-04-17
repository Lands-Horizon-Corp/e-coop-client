import { ITimeStamps, TEntityId } from './common'
import { IPaginatedResult } from './paginated-result'

export interface IGenderRequest {
    name: string
    description?: string
}

export interface IGenderResource extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
}

export interface IGenderPaginatedResource
    extends IPaginatedResult<IGenderResource> {}
