import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { HolidaySchema } from './holiday.validation'

export interface IHoliday extends IBaseEntityMeta {
    name: string
    entry_date: string
    description?: string
}

export type IHolidayRequest = z.infer<typeof HolidaySchema>

export interface IHolidayPaginated extends IPaginatedResult<IHoliday> {}
