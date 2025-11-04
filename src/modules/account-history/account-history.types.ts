import z from 'zod'

import { TIcon } from '@/components/icons'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import {
    IAccount,
    TAccountType,
    TComputationType,
    TEarnedUnearnedInterest,
    TInterestDeduction,
    TInterestFinesComputationDiminishing,
    TInterestFinesComputationDiminishingStraightDiminishingYearly,
    TInterestSavingTypeDiminishingStraight,
    TInterestStandardComputation,
    TLoanSavingType,
    TLumpsumComputationType,
    TOtherDeductionEntry,
    TOtherInformationOfAnAccount,
} from '../account/account.types'
import { TFinancialStatementType } from '../financial-statement-definition'
import { TGeneralLedgerType } from '../general-ledger'
import { AccountHistorySchema } from './account-history.validation'

export const HISTORY_CHANGE_TYPE = ['created', 'updated', 'deleted'] as const

export type THistoryChangeType = (typeof HISTORY_CHANGE_TYPE)[number]

export interface IAccountHistory extends IBaseEntityMeta {
    id: TEntityId

    account_id: TEntityId
    account?: IAccount

    change_type: THistoryChangeType
    valid_from: string
    valid_to?: string
    change_reason?: string
    changed_fields?: string

    name: string
    description: string
    typa?: TAccountType
    min_amount: number
    max_amount: number
    index: number

    is_internal: boolean
    cash_on_hand: boolean
    paid_up_share_capital: boolean

    computation_type: TComputationType

    fines_amort: number
    fines_maturity: number
    interest_standard: number
    interest_secured: number

    fines_grace_period_amortization: number
    additional_grace_period: number
    number_grace_period_daily: boolean
    fines_grace_period_maturity: number
    yearly_subscription_fee: number
    loan_cut_off_days: number

    lumpsum_computation_type: TLumpsumComputationType
    interest_fines_computation_diminishing: TInterestFinesComputationDiminishing
    interest_fines_computation_diminishing_straight_yearly: TInterestFinesComputationDiminishingStraightDiminishingYearly
    earned_unearned_interest: TEarnedUnearnedInterest
    loan_saving_type: TLoanSavingType
    interest_deduction: TInterestDeduction
    other_deduction_entry: TOtherDeductionEntry
    interest_saving_type_diminishing_straight: TInterestSavingTypeDiminishingStraight
    other_information_of_an_account: TOtherInformationOfAnAccount

    financial_statement_type: TFinancialStatementType
    general_ledger_type: TGeneralLedgerType

    header_row: number
    center_row: number
    total_row: number

    general_ledger_grouping_exclude_account: boolean
    icon: TIcon

    show_in_general_ledger_source_withdraw: boolean
    show_in_general_ledger_source_deposit: boolean
    show_in_general_ledger_source_journal: boolean
    show_in_general_ledger_source_payment: boolean
    show_in_general_ledger_source_adjustment: boolean
    show_in_general_ledger_source_journal_voucher: boolean
    show_in_general_ledger_source_check_voucher: boolean

    compassion_fund: boolean
    compassion_fund_amount: number
    cash_and_cash_equivalence: boolean

    interest_standard_computation: TInterestStandardComputation

    general_ledger_definition_id?: TEntityId
    financial_statement_definition_id?: TEntityId
    account_classification_id?: TEntityId
    account_category_id?: TEntityId
    member_type_id?: TEntityId
    currency_id?: TEntityId
    computation_sheet_id?: TEntityId
    alternative_account_id?: TEntityId

    coh_cib_fines_grace_period_entry_cash_hand: number
    coh_cib_fines_grace_period_entry_cash_in_bank: number
    coh_cib_fines_grace_period_entry_daily_amortization: number
    coh_cib_fines_grace_period_entry_daily_maturity: number
    coh_cib_fines_grace_period_entry_weekly_amortization: number
    coh_cib_fines_grace_period_entry_weekly_maturity: number
    coh_cib_fines_grace_period_entry_monthly_amortization: number
    coh_cib_fines_grace_period_entry_monthly_maturity: number
    coh_cib_fines_grace_period_entry_semi_monthly_amortization: number
    coh_cib_fines_grace_period_entry_semi_monthly_maturity: number
    coh_cib_fines_grace_period_entry_quarterly_amortization: number
    coh_cib_fines_grace_period_entry_quarterly_maturity: number
    coh_cib_fines_grace_period_entry_semi_anual_amortization: number
    coh_cib_fines_grace_period_entry_semi_anual_maturity: number
    coh_cib_fines_grace_period_entry_lumpsum_amortization: number
    coh_cib_fines_grace_period_entry_lumpsum_maturity: number
}

export type IAccountHistoryRequest = z.infer<typeof AccountHistorySchema>

export interface IAccountHistoryPaginated
    extends IPaginatedResult<IAccountHistory> {}
