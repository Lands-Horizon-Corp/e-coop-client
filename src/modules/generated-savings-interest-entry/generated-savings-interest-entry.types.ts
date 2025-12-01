import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { IGeneratedSavingsInterest } from '../generated-savings-interest'
import { IMemberProfile } from '../member-profile'
import { TGeneratedSavingsInterestEntrySchema } from './generated-savings-interest-entry.validation'

export interface IGeneratedSavingsInterestEntry extends IBaseEntityMeta {
    generated_savings_interest_id: TEntityId
    generated_savings_interest?: IGeneratedSavingsInterest

    account_id: TEntityId
    account?: IAccount

    member_profile_id: TEntityId
    member_profile?: IMemberProfile

    interest_amount: number
    interest_tax: number
    ending_balance: number
}

export type IGeneratedSavingsInterestEntryRequest =
    TGeneratedSavingsInterestEntrySchema

export interface IGeneratedSavingsInterestEntryPaginated
    extends IPaginatedResult<IGeneratedSavingsInterestEntry> {}
