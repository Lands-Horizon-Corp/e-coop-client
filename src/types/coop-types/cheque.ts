import { ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from './paginated-result'

export interface IChequeResponse {
    id: TEntityId
    bank: string
    check_date: Date
    media_id: TEntityId
    description: string
}

export interface IChequeResource extends ITimeStamps {
    id: TEntityId
    bank: string
    check_date: Date
    media_id: TEntityId
    description: string
}

export type IChequePaginatedResource = IPaginatedResult<IChequeResource>
