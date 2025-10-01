import { IJournalVoucher } from '@/modules/journal-voucher'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { IMemberProfile } from '../member-profile'
import { IUser } from '../user'

export interface IJournalVoucherEntry extends IBaseEntityMeta {
    cash_check_voucher_number: string
    account_id: TEntityId
    account: IAccount

    member_profile_id?: TEntityId
    member_profile?: IMemberProfile

    employee_user_id?: TEntityId
    employee_user?: IUser

    journal_voucher_id: TEntityId
    journal_voucher?: IJournalVoucher

    description?: string
    debit: number
    credit: number
}

export interface IJournalVoucherEntryRequest {
    id?: TEntityId
    cash_check_voucher_number?: string

    transaction_batch_id?: TEntityId
    employee_user_id?: TEntityId

    account?: IAccount
    account_id?: TEntityId

    member_profile?: IMemberProfile
    member_profile_id?: TEntityId

    debit: number
    credit: number

    rowId?: string
}

export interface IJournalVoucherEntryPaginated
    extends IPaginatedResult<IJournalVoucherEntry> {}
