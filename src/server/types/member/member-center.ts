import { ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberCenterHistoryResource } from './member-center-history'

export interface IMemberCenterRequest {
    id?: TEntityId
    name: string
    description: string
    history?: IMemberCenterHistoryResource[]
}

export interface IMemberCenterResource extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
    history?: IMemberCenterHistoryResource[]
}

export interface IMemberCenterPaginatedResource
    extends IPaginatedResult<IMemberCenterResource> {}
