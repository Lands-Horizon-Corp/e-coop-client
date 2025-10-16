import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IChargesRateScheme } from '../charges-rate-scheme'

export interface IChargesRateByRangeOrMinimumAmount extends IBaseEntityMeta {
    charges_rate_scheme_id: TEntityId
    charges_rate_scheme: IChargesRateScheme

    from: number
    to: number
    charges: number
    minimum_amount: number
}

export interface IChargesRateByRangeOrMinimumAmountRequest {
    charges_rate_scheme_id: TEntityId

    from: number
    to: number
    charges: number
    minimum_amount: number
}

export interface IChargesRateByRangeOrMinimumAmountPaginated
    extends IPaginatedResult<IChargesRateByRangeOrMinimumAmount> {}
