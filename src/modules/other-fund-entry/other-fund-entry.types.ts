import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { ILoanTransaction } from '../loan-transaction'
import { IMemberProfile } from '../member-profile'
import { IOtherFund } from '../other-fund/other-fund.types'
import { IUser } from '../user'
import { OtherFundEntrySchema } from './other-fund-entry.validation'

export interface IOtherFundEntry extends IBaseEntityMeta {
    account_id: TEntityId
    account?: IAccount

    member_profile_id?: TEntityId
    member_profile?: IMemberProfile

    employee_user_id?: TEntityId
    employee_user?: IUser

    other_fund_id: TEntityId
    other_fund?: IOtherFund

    loan_transaction_id?: TEntityId
    loan_transaction?: ILoanTransaction

    description: string
    debit: number
    credit: number
}

export type IOtherFundEntryRequest = z.infer<typeof OtherFundEntrySchema>

export interface IOtherFundEntryPaginated extends IPaginatedResult<IOtherFundEntry> {}
