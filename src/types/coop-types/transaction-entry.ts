import { IUserBase } from '../auth'
import { IBaseEntityMeta, TEntityId } from '../common'
import { IAccount } from './accounts/account'
import { IMedia } from './media'
import { IMemberJointAccount } from './member/member-joint-account'
import { IMemberProfile } from './member/member-profile'
import { IPaginatedResult } from './paginated-result'
import { ITransactionBatch } from './transaction-batch'

export const GENERAL_LEDGER_SOURCE = [
    'withdraw',
    'deposit',
    'journal',
    'payment',
    'adjustment',
    'journal voucher',
    'check voucher',
] as const

export enum generalLedgerSourceEnum {
    'withdraw',
    'deposit',
    'journal',
    'payment',
    'adjustment',
    'journal voucher',
    'check voucher',
}

export interface ITransactionEntry extends IBaseEntityMeta {
    member_profile_id?: TEntityId | null
    member_profile?: IMemberProfile | null

    employee_user_id?: TEntityId | null
    employee_user?: IUserBase | null

    transaction_id: TEntityId | null
    // TODO: transaction?: ITransaction | null

    member_joint_account_id?: TEntityId | null
    member_joint_account?: IMemberJointAccount | null

    general_accounting_ledger_id: TEntityId | null
    // TODO: general_accounting_ledger?: IGeneralAccountingLedger | null

    transaction_batch_id?: TEntityId | null
    transaction_batch?: ITransactionBatch | null

    signature_media_id?: TEntityId | null
    signature_media?: IMedia | null

    account_id: TEntityId | null
    account?: IAccount | null

    reference_number: string
    debit: number
    credit: number
}

export interface ITransactionEntryRequest {
    member_profile_id: TEntityId
    account_id: TEntityId
    account?: IAccount
    media_id?: TEntityId

    reference_number?: string
    amount: number
    genieral_ledger_source: generalLedgerSourceEnum
    payment_date?: string
}

export interface ITransactionEntryPaginated
    extends IPaginatedResult<ITransactionEntry> {}
