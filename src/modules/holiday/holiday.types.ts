import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { ICurrency } from '../currency'
import { HolidaySchema } from './holiday.validation'

export interface IHoliday extends IBaseEntityMeta {
    name: string
    entry_date: string

    currency_id: TEntityId
    currency: ICurrency

    description?: string
}

export type IHolidayRequest = z.infer<typeof HolidaySchema>

export interface IHolidayPaginated extends IPaginatedResult<IHoliday> {}

export interface IHolidayYears {
    year: number
    count: number
}

// FOR HOOK MODE
export type THolidayHookMode = 'all' | 'currency' | 'year' | 'year-currency'
