import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { InterestRateByAmountSchema } from './interest-rate-by-amount.validation'

export interface IInterestRateByAmount extends IBaseEntityMeta {
    from_amount: number
    to_amount: number
    interest_rate: number
}

export type IInterestRateByAmountRequest = z.infer<
    typeof InterestRateByAmountSchema
>

export interface IInterestRateByAmountPaginated extends IPaginatedResult<IInterestRateByAmount> {}
