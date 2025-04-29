import { ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberClassificationHistory } from './member-classification-history'

export interface IMemberClassification extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
    history?: IMemberClassificationHistory[]
}

export interface IMemberClassificationRequest {
    name: string
    description: string
}

export interface IMemberClassificationPaginated
    extends IPaginatedResult<IMemberClassification> {}
