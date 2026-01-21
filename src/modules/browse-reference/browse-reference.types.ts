import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

import { IAccount } from '../account'
import { IInterestRateByAmount } from '../interest-rate-by-amount'
import { IInterestRateByDate } from '../interest-rate-by-date'
import { IInterestRateByYear } from '../interest-rate-by-year'
import { IMemberType } from '../member-type/member-type.types'
import { INTEREST_TYPE } from './browse-reference.constant'
import { TBrowseReferenceSchema } from './browse-reference.validation'

export type TInterestType = (typeof INTEREST_TYPE)[number]

// LATEST FROM ERD
export type IBrowseReferenceRequest = TBrowseReferenceSchema

// LATEST FROM ERD
export interface IBrowseReference extends IBaseEntityMeta {
    id: TEntityId

    name: string

    account_id: TEntityId
    account: IAccount

    member_type_id: TEntityId
    member_type: IMemberType

    description: string
    minimum_balance: number
    interest_rate: number
    charges: number

    interest_type: TInterestType

    other_interest_on_saving_computation_minimum_balance?: number
    other_interest_on_saving_computation_interest_rate?: number

    interest_rates_by_year: IInterestRateByYear[]
    interest_rates_by_date: IInterestRateByDate[]
    interest_rates_by_amount: IInterestRateByAmount[]
}

export interface IBrowseReferencePaginated extends IPaginatedResult<IBrowseReference> {}
