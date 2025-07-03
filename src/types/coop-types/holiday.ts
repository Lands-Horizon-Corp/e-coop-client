import { IBaseEntityMeta, TEntityId } from '../common'
import { IPaginatedResult } from './paginated-result'

export interface IHoliday extends IBaseEntityMeta {
    name: string
    entry_date: string
    description: string
}

export interface IHolidayRequest {
    id?: TEntityId
    entry_date: string
    description: string
}

export interface IHolidayPaginated extends IPaginatedResult<IHoliday> {}
