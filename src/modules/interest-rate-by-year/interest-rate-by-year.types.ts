import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { IBrowseReference } from '../browse-reference'
import { InterestRateByYearSchema } from './interest-rate-by-year.validation'

export interface IInterestRateByYear extends IBaseEntityMeta {
    browse_reference_id: string
    browse_reference?: IBrowseReference

    from_year: number
    to_year: number
    interest_rate: number
}

export type IInterestRateByYearRequest = z.infer<
    typeof InterestRateByYearSchema
>

export interface IInterestRateByYearPaginated
    extends IPaginatedResult<IInterestRateByYear> {}
