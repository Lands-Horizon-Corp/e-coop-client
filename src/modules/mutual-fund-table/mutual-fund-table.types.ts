import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { MutualFundTableSchema } from './mutual-fund-table.validation'

export interface IMutualFundTable extends IBaseEntityMeta {
    months_from: number
    months_to: number
    amount: number
}

export type IMutualFundTableRequest = z.infer<typeof MutualFundTableSchema>

export interface IMutualFundTablePaginated extends IPaginatedResult<IMutualFundTable> {}
