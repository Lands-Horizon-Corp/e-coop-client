import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

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
