import { IPaginatedResult } from './paginated-result'
import { IBaseEntityMeta, TEntityId } from '../common'

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

export interface IPaginatedHoliday extends IPaginatedResult<IHoliday> {}
