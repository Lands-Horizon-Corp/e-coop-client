import { IBank } from './bank'
import { IMedia } from './media'
import { IUserBase } from '../auth'
import { IPaginatedResult } from './paginated-result'
import { IBaseEntityMeta, TEntityId } from '../common'
import { IMemberProfile } from './member/member-profile'
import { TTransactionBatchFullorMin } from './transaction-batch'
import { IMemberJointAccount } from './member/member-joint-account'

export interface ICheckEntry extends IBaseEntityMeta {
    account_id?: TEntityId
    // TODO: account? : IAccount

    media_id?: TEntityId
    media?: IMedia

    bank_id?: TEntityId
    bank?: IBank

    member_profile_id?: TEntityId
    member_profile?: IMemberProfile

    member_joint_account_id?: TEntityId
    member_joint_account?: IMemberJointAccount

    employee_user_id?: TEntityId
    employee_user?: IUserBase

    transaction_id?: TEntityId
    // TODO: transaction : ITransaction | null

    transaction_batch_id?: TEntityId
    transaction_batch?: TTransactionBatchFullorMin

    general_accounting_ledger_id?: TEntityId // nullabler if disbursement
    // TODO: general_accounting_ledger : IGeneralAccountingLedger

    disbursement_transaction_id?: TEntityId
    // TODO: disbursement_transaction? : IDisbursementTransaction | null

    check_number: string
    credit: number
    debit: number
    check_date: string
}

export interface ICheckEntryPaginated extends IPaginatedResult<ICheckEntry> {}
