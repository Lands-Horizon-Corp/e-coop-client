import { ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberCenterHistory } from './member-center-history'

export interface IMemberCenterRequest {
    id?: TEntityId
    name: string
    description: string
    history?: IMemberCenterHistory[]
}

export interface IMemberCenter extends ITimeStamps {
    id: TEntityId
    name: string
    description: string
    history?: IMemberCenterHistory[]
}

export interface IMemberCenterPaginated
    extends IPaginatedResult<IMemberCenter> {}
