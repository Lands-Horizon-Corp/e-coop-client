import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { IComakerCollateral } from '../comaker-collateral'
import { IComakerMemberProfile } from '../comaker-member-profile'
import { ILoanClearanceAnalysis } from '../loan-clearance-analysis'
import { ILoanClearanceAnalysisInstitution } from '../loan-clearance-analysis-institution'
import { ILoanPurpose } from '../loan-purpose'
import { ILoanStatus } from '../loan-status'
import { ILoanTermsAndConditionAmountReceipt } from '../loan-terms-and-condition-amount-receipt'
import { ILoanTermsAndConditionSuggestedPayment } from '../loan-terms-and-condition-suggested-payment'
import { ILoanTransactionEntry } from '../loan-transaction-entry'
import { IMedia } from '../media'
import { IMemberAccountingLedger } from '../member-account-ledger'
import { IMemberProfile } from '../member-profile'
import { ITransactionBatch } from '../transaction-batch'
import { IUser } from '../user'
import {
    LoanTransactionSchema,
    TLoanTransactionSignatureSchema,
} from './loan-transaction.validation'
import {
    COMPUTATION_TYPE,
    LOAN_AMORTIZATION_TYPE,
    LOAN_COLLECTOR_PLACE,
    LOAN_COMAKER_TYPE,
    LOAN_MODE_OF_PAYMENT,
    LOAN_TYPE,
    WEEKDAYS,
} from './loan.constants'

export type TLoanModeOfPayment = (typeof LOAN_MODE_OF_PAYMENT)[number]

export type TWeekdays = (typeof WEEKDAYS)[number]

export type TLoanCollectorPlace = (typeof LOAN_COLLECTOR_PLACE)[number]

export type TLoanComakerType = (typeof LOAN_COMAKER_TYPE)[number]

export type TLoanType = (typeof LOAN_TYPE)[number]

export type TLoanAmortizationType = (typeof LOAN_AMORTIZATION_TYPE)[number]

export type TComputationType = (typeof COMPUTATION_TYPE)[number]

// NOT SERVER/ONLY CLIENT GENERATED
export type TLoanStatusType = 'draft' | 'printed' | 'approved' | 'released'

export interface ILoanTransaction
    extends IBaseEntityMeta,
        ILoanTransactionSignatures,
        ILoanTransactionStatusDates {
    voucher_no?: string

    transaction_batch_id?: TEntityId
    transaction_batch?: ITransactionBatch
    official_receipt_number: string

    employee_user_id?: TEntityId
    employee_user?: IUser

    loan_purpose_id?: TEntityId
    loan_purpose?: ILoanPurpose

    loan_status_id?: TEntityId
    loan_status?: ILoanStatus

    mode_of_payment: TLoanModeOfPayment
    mode_of_payment_weekly: TWeekdays
    mode_of_payment_semi_monthly_pay_1: number
    mode_of_payment_semi_monthly_pay_2: number
    mode_of_payment_monthly_exact_day: boolean

    comaker_type: TLoanComakerType

    // Pag comaker type ay deposit
    comaker_deposit_member_accounting_ledger_id?: TEntityId
    comaker_deposit_member_accounting_ledger?: IMemberAccountingLedger

    comaker_collaterals?: IComakerCollateral[] // pag comaker ay collaterals
    comaker_member_profiles: IComakerMemberProfile[] // pag comaker ay member

    collector_place: TLoanCollectorPlace

    loan_type: TLoanType
    previous_loan_id?: TEntityId
    previous_loan?: ILoanTransaction
    terms: number

    amortization_amount: number
    is_add_on: boolean

    applied_1: number
    applied_2: number

    account_id?: TEntityId
    account?: IAccount
    member_profile_id?: TEntityId
    member_profile?: IMemberProfile

    member_joint_account_id?: TEntityId
    member_joint_account?: IAccount

    signature_media_id?: TEntityId
    signature_media?: IMedia

    mount_to_be_closed: number
    damayan_fund: number
    share_capital: number
    length_of_service: string

    loan_transaction_entries: ILoanTransactionEntry[]
    loan_transaction_entries_deleted: TEntityId[] // nothing, just for type

    //Loan Clearance Analysis
    loan_clearance_analysis: ILoanClearanceAnalysis[]
    loan_clearance_analysis_deleted?: TEntityId[] // nothing, just for type

    loan_clearance_analysis_institution: ILoanClearanceAnalysisInstitution[]
    loan_clearance_analysis_institution_deleted?: TEntityId[] // nothing, just for type

    // Terms and Condition / Receipt
    loan_terms_and_condition_amount_receipt: ILoanTermsAndConditionAmountReceipt[]
    loan_terms_and_condition_amount_receipt_deleted?: TEntityId[] // nothing, just for type

    loan_terms_and_condition_suggested_payment: ILoanTermsAndConditionSuggestedPayment[]
    loan_terms_and_condition_suggested_payment_deleted?: TEntityId[] // nothing, just for type

    exclude_sunday: boolean
    exclude_holiday: boolean
    exclude_saturday: boolean

    remarks_other_terms: string
    remarks_payroll_deduction: boolean
    record_of_loan_payments_or_loan_status: string
    collateral_offered: string

    appraised_value: number
    appraised_value_description: string
}

export interface ILoanTransactionStatusDates {
    printed_date?: string // Printed
    approved_date?: string //
    released_date?: string // Not editable anymore
}

export interface ILoanTransactionSignatures {
    approved_by_signature_media_id?: TEntityId
    approved_by_signature_media?: IMedia
    approved_by_name: string
    approved_by_position: string

    prepared_by_signature_media_id?: TEntityId
    prepared_by_signature_media?: IMedia
    prepared_by_name: string
    prepared_by_position: string

    certified_by_signature_media_id?: TEntityId
    certified_by_signature_media?: IMedia
    certified_by_name: string
    certified_by_position: string

    verified_by_signature_media_id?: TEntityId
    verified_by_signature_media?: IMedia
    verified_by_name: string
    verified_by_position: string

    check_by_signature_media_id?: TEntityId
    check_by_signature_media?: IMedia
    check_by_name: string
    check_by_position: string

    acknowledge_by_signature_media_id?: TEntityId
    acknowledge_by_signature_media?: IMedia
    acknowledge_by_name: string
    acknowledge_by_position: string

    noted_by_signature_media_id?: TEntityId
    noted_by_signature_media?: IMedia
    noted_by_name: string
    noted_by_position: string

    posted_by_signature_media_id?: TEntityId
    posted_by_signature_media?: IMedia
    posted_by_name: string
    posted_by_position: string

    paid_by_signature_media_id?: TEntityId
    paid_by_signature_media?: IMedia
    paid_by_name: string
    paid_by_position: string
}

export type ILoanTransactionRequest = z.infer<typeof LoanTransactionSchema>

export interface ILoanTransactionPaginated
    extends IPaginatedResult<ILoanTransaction> {}

// Amortization Schedule Types
export interface IAmortizationPayment {
    date: string
    principal: number
    lr: number // Loan Receivable (remaining balance)
    interest: number
    service_fee: number
    total: number
}

export interface IAmortizationSummary {
    total_terms: number
    total_principal: number
    total_interest: number
    total_service_fee: number
    total_amount: number
    loan_amount: number
    monthly_payment: number
    interest_rate: number
    computation_type: string
    mode_of_payment: string
}

export interface ILoanDetails {
    passbook_no: string
    member_name: string
    classification: string
    investment: number
    due_date: string
    account_applied: number
    voucher: string
}

export interface IAmortizationSchedule {
    loan_details: ILoanDetails
    amortization_schedule: IAmortizationPayment[]
    summary: IAmortizationSummary
    generated_at: string
}

// Loan Transaction Signature
export type ILoanTransactionSignatureRequest = TLoanTransactionSignatureSchema
