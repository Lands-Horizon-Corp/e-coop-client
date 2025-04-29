import { ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberEducationalAttainmentHistory } from './member-educational-attainment-history'

export interface IMemberEducationalAttainmentRequest {
    name: string
    description: string
}

export interface IMemberEducationalAttainment extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
    history?: IMemberEducationalAttainmentHistory[]
}

export interface IMemberEducationalAttainmentPaginated
    extends IPaginatedResult<IMemberEducationalAttainment> {}
