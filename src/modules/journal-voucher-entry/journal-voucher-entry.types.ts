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
    account_id: TEntityId
    member_profile_id?: TEntityId
    employee_user_id?: TEntityId
    cash_check_voucher_number: string
    rowId?: string

    description?: string
    debit: number
    credit: number
}

export interface IJournalVoucherEntryPaginated
    extends IPaginatedResult<IJournalVoucherEntry> {}
