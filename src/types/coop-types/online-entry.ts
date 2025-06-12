import { IBank } from './bank'
import { IUserBase } from '../auth'
import { IBaseEntityMeta, TEntityId } from '../common'
import { ITransactionBatch } from './transaction-batch'
import { IMemberProfile } from './member/member-profile'
import { IMemberJointAccount } from './member/member-joint-account'
import { IPaginatedResult } from './paginated-result'

export interface IOnlineEntry extends IBaseEntityMeta {
    bank_id: TEntityId | null
    bank: IBank | null

    account_id: TEntityId | null
    // TODO: account : IAccount | null

    member_profile_id: TEntityId | null
    member_profile: IMemberProfile | null

    member_joint_account_id: TEntityId | null
    member_joint_account: IMemberJointAccount | null

    transaction_batch_id: TEntityId | null
    transaction_batch: ITransactionBatch | null

    general_accounting_ledger_id: TEntityId | null
    // TODO: general_accounting_ledger : IGeneralAccountingLedger | null

    transaction_id: TEntityId | null
    // TODO: transaction : ITransaction | null

    employee_user_id: TEntityId | null
    employee_user: IUserBase | null

    disbursement_transaction_id?: TEntityId | null
    // TODO: disbursement_transaction? : IDisbursementTransaction | null

    reference_number: string
    payment_Date: string | null
    debit: number
    credit: number
}

export interface IOnlineEntryPaginated extends IPaginatedResult<IOnlineEntry> {}
