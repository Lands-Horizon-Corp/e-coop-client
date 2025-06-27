import { IBank } from './bank'
import { IUserBase } from '../auth'
import { IPaginatedResult } from './paginated-result'
import { IBaseEntityMeta, TEntityId } from '../common'
import { ITransactionBatch } from './transaction-batch'
import { IMemberProfile } from './member/member-profile'
import { IMemberJointAccount } from './member/member-joint-account'

export interface IOnlineEntry extends IBaseEntityMeta {
    bank_id?: TEntityId
    bank?: IBank

    account_id?: TEntityId
    // TODO: account? : IAccount

    member_profile_id?: TEntityId
    member_profile?: IMemberProfile

    member_joint_account_id?: TEntityId
    member_joint_account?: IMemberJointAccount

    transaction_batch_id?: TEntityId
    transaction_batch?: ITransactionBatch

    general_accounting_ledger_id?: TEntityId
    // TODO: general_accounting_ledger? : IGeneralAccountingLedger

    transaction_id?: TEntityId
    // TODO: transaction? : ITransaction

    employee_user_id?: TEntityId
    employee_user?: IUserBase

    disbursement_transaction_id?: TEntityId
    // TODO: disbursement_transaction? : IDisbursementTransaction

    reference_number: string
    payment_Date?: string
    debit: number
    credit: number
}

export interface IOnlineEntryPaginated extends IPaginatedResult<IOnlineEntry> {}
