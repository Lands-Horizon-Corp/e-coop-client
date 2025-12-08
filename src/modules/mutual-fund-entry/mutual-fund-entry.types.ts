import z from 'zod'

import { IAccount } from '@/modules/account'
import { IMemberProfile } from '@/modules/member-profile'
import { IMutualFund } from '@/modules/mutual-fund'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { MutualFundEntrySchema } from './mutual-fund-entry.validation'

export interface IMutualFundEntry extends IBaseEntityMeta {
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    account_id: TEntityId
    account?: IAccount

    amount: number

    mutual_fund_id: TEntityId
    mutual_fund: IMutualFund
}

export type IMutualFundEntryRequest = z.infer<typeof MutualFundEntrySchema>

export interface IMutualFundEntryPaginated
    extends IPaginatedResult<IMutualFundEntry> {}
