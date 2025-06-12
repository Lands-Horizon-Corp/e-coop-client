import { IUserBase } from '../auth'
import { IPaginatedResult } from './paginated-result'
import { IBaseEntityMeta, TEntityId } from '../common'
import { IMemberProfile } from './member/member-profile'
import { TTransactionBatchFullorMin } from './transaction-batch'
import { IMemberJointAccount } from './member/member-joint-account'

export interface ICashEntry extends IBaseEntityMeta {
    id: TEntityId

    account_id?: TEntityId | null // null pag disbursement
    // TODO: account? : IAccount | null

    member_profile_id?: TEntityId | null // null pag disbursement
    member_profile?: IMemberProfile | null

    member_joint_account_id?: TEntityId | null // other joint account na gumamit nang member profile to transact
    member_joint_account?: IMemberJointAccount | null

    transaction_batch_id?: TEntityId | null
    transaction_batch?: TTransactionBatchFullorMin

    general_accounting_ledger_id?: TEntityId | null // nullabler if disbursement
    // TODO: general_accounting_ledger : IGeneralAccountingLedger

    transaction_id?: TEntityId | null // nullable if disbursement
    // TODO : transaction? : ITransaction | null

    employee_user_id: TEntityId | null
    employee_user: IUserBase | null

    disbursement_transaction_id?: TEntityId | null
    // TODO: disbursement_transaction? : IDisbursementTransaction | null

    reference_number: string
    debit: number
    credit: number
}

export interface ICashEntryPaginated extends IPaginatedResult<ICashEntry> {}
