import {
    IBaseEntityMeta,
    TEntityId,
    TLoanCollectorPlace,
    TLoanModeOfPayment,
    TLoanType,
    TWeekdays,
} from '@/types/common'

import { IAccount } from '../account'
import { ICollateral } from '../collateral'
import { ILoanPurpose } from '../loan-purpose'
import { ILoanStatus } from '../loan-status'
import { ILoanTagResponse } from '../loan-tag'
import { IMedia } from '../media/media.types'
import { IMemberAccountingLedger } from '../member-account-ledger'
import { IMemberJointAccount } from '../member-joint-account/member-joint-account.types'
import { IMemberProfile } from '../member-profile/member-profile.types'

export interface ILoanTransactionRequest {
    id?: TEntityId
}

export interface ILoanTransaction extends IBaseEntityMeta {
    transaction_batch_id: TEntityId
    official_receipt_number: string

    loan_purpose_id: TEntityId
    loan_purpose: ILoanPurpose

    loan_status_id: TEntityId
    loan_status: ILoanStatus

    loan_tags: ILoanTagResponse[]

    mode_of_payment: TLoanModeOfPayment
    mode_of_payment_weekly: TWeekdays
    mode_of_payment_semi_monthly_pay_1: number
    mode_of_payment_semi_monthly_pay_2: number

    comaker_deposit_member_accounting_ledger_id: TEntityId
    comaker_deposit_member_accounting_ledger: IMemberAccountingLedger

    comaker_collateral_id?: TEntityId
    comaker_collateral?: ICollateral

    comaker_collateral_description?: string

    collector_place: TLoanCollectorPlace
    loan_type: TLoanType

    previous_loan_id?: TEntityId
    previous_loan?: ILoanTransaction

    terms: number

    amortization_amount: number
    is_add_on: boolean

    applied_1: number
    applied_2?: number

    account_id?: TEntityId
    account?: IAccount

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    member_joint_account_id?: TEntityId
    member_joint_account?: IMemberJointAccount

    signature_media_id?: TEntityId
    signature_media?: IMedia

    mount_to_be_closed?: number
    damayan_fund?: number
    share_capital?: number
    length_of_service?: string

    exclude_sunday?: boolean // default: false
    exclude_holiday?: boolean // default: false
    exclude_saturday?: boolean // default: false

    // Remarks / Terms & Condition
    remarks_other_terms?: string
    remarks_payroll_deduction?: boolean // default: false
    record_of_loan_payments_or_loan_status?: string

    collateral_offered?: string

    // LOAN APPRAISED VALUE - Other/jewelry tab in old coop
    appraised_value?: number
    appraised_value_description?: string

    printed_date?: Date
    approved_date?: Date
    released_date?: Date // Transaction batch CDV History and CASH Voucher on release

    // SIGNATURES
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
