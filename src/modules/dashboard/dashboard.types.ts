import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { DashboardSchema } from './dashboard.validation'

export interface IDashboard extends IBaseEntityMeta {
    //add here
}

export type IDashboardRequest = z.infer<typeof DashboardSchema>

export interface IDashboardPaginated extends IPaginatedResult<IDashboard> {}
