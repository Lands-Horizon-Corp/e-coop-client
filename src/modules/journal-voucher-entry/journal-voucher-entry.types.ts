import { IJournalVoucher } from '@/modules/journal-voucher'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { ILoanTransaction } from '../loan-transaction'
import { IMemberProfile } from '../member-profile'
import { IUser } from '../user'
import { TJournalVoucherEntrySchema } from './journal-voucher-entry.validation'

export interface IJournalVoucherEntry extends IBaseEntityMeta {
    loan_transaction_id?: TEntityId
    loan_transaction: ILoanTransaction

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

export type IJournalVoucherEntryRequest = TJournalVoucherEntrySchema

export interface IJournalVoucherEntryPaginated
    extends IPaginatedResult<IJournalVoucherEntry> {}
