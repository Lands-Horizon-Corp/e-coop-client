import { ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberClassificationHistoryResource } from './member-classification-history'

export interface IMemberClassificationResource extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
    history?: IMemberClassificationHistoryResource[]
}

export interface IMemberClassificationRequest {
    name: string
    description: string
}

export interface IMemberClassificationPaginatedResource
    extends IPaginatedResult<IMemberClassificationResource> {}
