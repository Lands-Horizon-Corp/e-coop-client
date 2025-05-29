import { IBank } from './bank'
import { IMedia } from './media'
import { IUserBase } from '../auth'
import { IBaseEntityMeta, TEntityId } from '../common'
import { IMemberProfile } from './member/member-profile'
import { TTransactionBatchFullorMin } from './transaction-batch'
import { IMemberJointAccount } from './member/member-joint-account'
import { IPaginatedResult } from './paginated-result'

export interface ICheckEntry extends IBaseEntityMeta {
    account_id: TEntityId | null
    // TODO: account : IAccount | null

    media_id: TEntityId | null
    media: IMedia | null

    bank_id: TEntityId | null
    bank: IBank

    member_profile_id: TEntityId | null
    member_profile: IMemberProfile | null

    member_joint_account_id: TEntityId | null
    member_joint_account: IMemberJointAccount | null

    employee_user_id: TEntityId | null
    employee_user: IUserBase | null

    transaction_id: TEntityId | null
    // TODO: transaction : ITransaction | null

    transaction_batch_id: TEntityId | null
    transaction_batch: TTransactionBatchFullorMin

    general_accounting_ledger_id?: TEntityId | null // nullabler if disbursement
    // TODO: general_accounting_ledger : IGeneralAccountingLedger

    disbursement_transaction_id?: TEntityId | null
    // TODO: disbursement_transaction? : IDisbursementTransaction | null

    check_number: string
    credit: number
    debit: number
    check_date: string
}

export interface ICheckEntryPaginated extends IPaginatedResult<ICheckEntry> {}
