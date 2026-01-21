import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IBrowseReference } from '../browse-reference'
import { InterestRateByDateSchema } from './interest-rate-by-date.validation'

export interface IInterestRateByDate extends IBaseEntityMeta {
    browse_reference_id: TEntityId
    browse_reference: IBrowseReference

    from_date: string
    to_date: string
    interest_rate: number
}

export type IInterestRateByDateRequest = z.infer<
    typeof InterestRateByDateSchema
>

export interface IInterestRateByDatePaginated
    extends IPaginatedResult<IInterestRateByDate> {}
