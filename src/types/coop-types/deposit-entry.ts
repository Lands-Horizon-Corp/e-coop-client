import { IUserBase } from '../auth'
import { IBaseEntityMeta, TEntityId } from '../common'
import { IMedia } from './media'
import { IMemberJointAccount } from './member/member-joint-account'
import { IMemberProfile } from './member/member-profile'
import { IPaginatedResult } from './paginated-result'
import { ITransactionBatch } from './transaction-batch'

export interface IDepositEntry extends IBaseEntityMeta {
    member_profile_id: TEntityId | null
    member_profile?: IMemberProfile | null

    transaction_id: TEntityId | null
    // TODO: transaction?: ITransaction | null

    member_joint_account_id: TEntityId | null
    member_joint_account?: IMemberJointAccount | null

    general_accounting_ledger_id: TEntityId | null
    // TODO: general_accounting_ledger?: IGeneralAccountingLedger | null

    transaction_batch_id: TEntityId | null
    transaction_batch?: ITransactionBatch | null

    signature_media_id: TEntityId | null
    signature_media?: IMedia | null

    account_id: TEntityId | null
    // TODO: account?: IAccount | null

    employee_user_id: TEntityId | null
    employee_user?: IUserBase | null

    reference_number: string
    amount: number
}

export interface IDepositEntryRequest {
    id?: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    member_profile_id?: TEntityId | null
    transaction_id?: TEntityId | null

    member_joint_account_id?: TEntityId | null

    general_accounting_ledger_id?: TEntityId | null

    transaction_batch_id?: TEntityId | null
    signature_media_id?: TEntityId | null

    account_id?: TEntityId | null

    employee_user_id?: TEntityId | null

    reference_number?: string
    amount: number
}

export interface IDepositEntryPaginated
    extends IPaginatedResult<IDepositEntry> {}
