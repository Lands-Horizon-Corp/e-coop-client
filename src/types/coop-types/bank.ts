import { IPaginatedResult } from './paginated-result'
import { ITimeStamps, TEntityId } from '@/types'

export interface IBankRequest {
    name: string
    mediaId: TEntityId
    description: string
}

export interface IBankResponse extends ITimeStamps {
    id: TEntityId
    name: string
    mediaId: TEntityId
    description: string
}

export interface IBankPaginatedResource
    extends IPaginatedResult<IBankResponse> {}
