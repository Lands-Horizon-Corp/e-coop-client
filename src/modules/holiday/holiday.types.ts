import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'
import { descriptionSchema } from '@/validation'

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

export const holidaySchema = z.object({
    name: z.string().min(1, 'Holiday name is required'),
    entry_date: z.string().min(1, 'Date is required'),
    description: descriptionSchema,
})

export type THolidayFormValues = z.infer<typeof holidaySchema>
