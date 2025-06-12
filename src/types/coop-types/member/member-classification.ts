import { IAuditable, ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'

// LATEST FROM ERD
export interface IMemberClassification extends ITimeStamps, IAuditable {
    id: TEntityId

    name: string
    icon: string
    description: string

    // history?: IMemberClassificationHistory[]
}

// LATEST FROM ERD
export interface IMemberClassificationRequest {
    id?: TEntityId

    name: string
    description: string
}

export interface IMemberClassificationPaginated
    extends IPaginatedResult<IMemberClassification> {}
