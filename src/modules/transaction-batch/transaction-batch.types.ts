import { IAuditable, IPaginatedResult, ITimeStamps, TEntityId } from '@/types'

import { IBatchFundingRequest } from '../batch-funding'
import { IBranch } from '../branch'
import { ICurrency } from '../currency'
import { IMedia } from '../media'
import { IOrganization } from '../organization'
import { IUserBase } from '../user'
import { TDepositInBankSchema } from './transaction-batch.validation'

export type TBatchBalanceStatus =
    | 'balanced'
    | 'balance overage'
    | 'balance shortage'

export interface ITransactionBatchRequest
    extends Omit<
        IBatchFundingRequest,
        'transaction_batch_id' | 'provided_by_user_id'
    > {
    provided_by_user_id?: TEntityId
}

export interface ITransactionBatch
    extends ITimeStamps,
        IAuditable,
        ITransactionBatchSignatures {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    branch_id: TEntityId
    branch: IBranch

    employee_user_id: TEntityId
    employee_user: IUserBase

    batch_name?: string

    beginning_balance: number

    deposit_in_bank: number // too lazy to cash count just know the total
    cash_count_total: number
    grand_total: number

    total_cash_collection: number
    total_deposit_entry: number

    // FOR LESS
    petty_cash: number
    loan_releases: number
    time_deposit_withdrawal: number
    savings_withdrawal: number

    total_cash_handled: number

    total_supposed_remitance: number
    total_cash_on_hand: number
    total_check_remittance: number
    total_online_remittance: number
    total_deposit_in_bank: number
    total_actual_remittance: number

    total_actual_supposed_comparison: number

    description?: string
    can_view: boolean
    request_view?: boolean
    is_closed: boolean

    ended_at?: string
    total_batch_time?: string

    currency_id: TEntityId
    currency: ICurrency
}

export interface ITransactionBatchMinimal
    extends Omit<
        ITransactionBatch,
        | 'total_cash_collection'
        | 'total_deposit_entry'
        | 'petty_cash'
        | 'loan_releases'
        | 'time_deposit_withdrawal'
        | 'savings_withdrawal'
        | 'total_cash_handled'
        | 'total_supposed_remitance'
        | 'total_cash_on_hand'
        | 'total_check_remittance'
        | 'total_online_remittance'
        | 'total_deposit_in_bank'
        | 'total_actual_remittance'
        | 'total_actual_supposed_comparison'
        | keyof ITransactionBatchSignatures
    > {}

export type TTransactionBatchFullorMin =
    | ITransactionBatch
    | ITransactionBatchMinimal

// SIGNATURES
export interface ITransactionBatchSignatures {
    employee_by_signature_media_id?: TEntityId
    employee_by_signature_media?: IMedia
    employee_by_name?: string
    employee_by_position?: string

    approved_by_signature_media_id?: TEntityId
    approved_by_signature_media?: IMedia
    approved_by_name?: string
    approved_by_position?: string

    prepared_by_signature_media_id?: TEntityId
    prepared_by_signature_media?: IMedia
    prepared_by_name?: string
    prepared_by_position?: string

    certified_by_signature_media_id?: TEntityId
    certified_by_signature_media?: IMedia
    certified_by_name?: string
    certified_by_position?: string

    verified_by_signature_media_id?: TEntityId
    verified_by_signature_media?: IMedia
    verified_by_name?: string
    verified_by_position?: string

    check_by_signature_media_id?: TEntityId
    check_by_signature_media?: IMedia
    check_by_name?: string
    check_by_position?: string

    acknowledge_by_signature_media_id?: TEntityId
    acknowledge_by_signature_media?: IMedia
    acknowledge_by_name?: string
    acknowledge_by_position?: string

    noted_by_signature_media_id?: TEntityId
    noted_by_signature_media?: IMedia
    noted_by_name?: string
    noted_by_position?: string

    posted_by_signature_media_id?: TEntityId
    posted_by_signature_media?: IMedia
    posted_by_name?: string
    posted_by_position?: string

    paid_by_signature_media_id?: TEntityId
    paid_by_signature_media?: IMedia
    paid_by_name?: string
    paid_by_position?: string
}

export type ITransactionBatchDepositInBankRequest = TDepositInBankSchema

export interface ITransactionBatchEndRequest {
    employee_by_signature_media_id: TEntityId
    employee_by_name: string
    employee_by_position: string
}

export interface ITransactionBatchPaginated
    extends IPaginatedResult<ITransactionBatch> {}
