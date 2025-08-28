import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { TGeneralLedgerSource } from '../general-ledger'
import { IMedia } from '../media'
import { IMemberJointAccount } from '../member-joint-account'
import { IMemberProfile } from '../member-profile'
import { ITransactionBatch } from '../transaction-batch'
import { IUserBase } from '../user'

export interface ITransactionRequest {
    signature_media_id?: TEntityId

    member_profile_id?: TEntityId
    member_joint_account_id?: TEntityId

    is_reference_number_checked?: boolean
    reference_number?: string
    source?: TGeneralLedgerSource
    description?: string
}

export interface ITransaction extends IBaseEntityMeta {
    amount: number
    source: TGeneralLedgerSource
    description: string

    acccount_id: TEntityId
    account: IAccount
    signature_media_id: TEntityId
    signature_media: IMedia | null

    transaction_batch_id: TEntityId
    transaction_batch: ITransactionBatch | null

    employee_user_id: TEntityId
    employee_user: IUserBase | null

    member_profile_id: TEntityId
    member_profile: IMemberProfile | null

    member_joint_account_id: TEntityId
    member_joint_account: IMemberJointAccount | null

    loan_balance: number
    loan_due: number
    total_due: number
    fines_due: number
    total_loan: number
    interest_due: number
    reference_number: string
}

export interface ITransactionPaginated extends IPaginatedResult<ITransaction> {}
