import { GENERAL_LEDGER_SOURCES } from '@/constants'

import { IEmployee } from '../auth'
import { IBaseEntityMeta } from '../common'
import { IAccount } from './accounts/account'
import { TTypeOfPaymentType } from './common'
import { IMemberJointAccount } from './member/member-joint-account'
import { IMemberProfile } from './member/member-profile'
import { IPaginatedResult } from './paginated-result'

export type TEntryType =
    | ''
    | 'check-entry'
    | 'online-entry'
    | 'cash-entry'
    | 'payment-entry'
    | 'withdraw-entry'
    | 'deposit-entry'
    | 'journal-entry'
    | 'adjustment-entry'
    | 'journal-voucher'
    | 'check-voucher'

export type TGeneralLedgerSource = (typeof GENERAL_LEDGER_SOURCES)[number]

export interface IGeneralLedger extends IBaseEntityMeta {
    account_id?: string
    account?: IAccount

    transaction_id?: string
    transaction_batch_id?: string

    employee_user_id?: string
    employee_user?: IEmployee

    member_profile_id?: string
    member_profile?: IMemberProfile

    member_joint_account_id?: string
    member_joint_account?: IMemberJointAccount

    transaction_reference_number?: string
    reference_number?: string
    payment_type_id?: string

    source?: TGeneralLedgerSource
    journal_voucher_id?: string
    adjustment_entry_id?: string
    type_of_payment_type?: TTypeOfPaymentType

    type?: string

    credit?: number
    debit?: number
    balance?: number
}

export interface IMemberGeneralLedgerTotal {
    total_debit: number
    total_credit: number
    balance: number
}

export interface IGeneralLedgerPaginated
    extends IPaginatedResult<IGeneralLedger> {}
