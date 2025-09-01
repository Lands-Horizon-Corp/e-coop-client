import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { IMemberProfile } from '../member-profile'

export interface IMemberAccountingLedger extends IBaseEntityMeta {
    id: TEntityId

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    account_id: TEntityId
    account: IAccount

    count: number
    balance: number
    interest: number
    fines: number
    due: number

    carried_forward_due: number
    stored_value_facility: number
    principal_due: number
    last_pay?: string

    hold_out?: string
}

export interface IMemberAccountingLedgerPaginated
    extends IPaginatedResult<IMemberAccountingLedger> {}

export interface IMemberAccountingLedgerTotal {
    total_share_capital_plus_savings: number
    total_deposits: number
    total_loans: number
}
