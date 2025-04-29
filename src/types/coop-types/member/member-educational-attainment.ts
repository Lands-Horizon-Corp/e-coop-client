import { ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberEducationalAttainmentHistoryResource } from './member-educational-attainment-history'

export interface IMemberEducationalAttainmentRequest {
    name: string
    description: string
}

export interface IMemberEducationalAttainmentResource extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
    history?: IMemberEducationalAttainmentHistoryResource[]
}

export interface IMemberEducationalAttainmentPaginatedResource
    extends IPaginatedResult<IMemberEducationalAttainmentResource> {}
