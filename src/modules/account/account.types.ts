import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { TIcon } from '@/components/icons'

import { IAccountCategory } from '../account-category'
import { IAccountClassification } from '../account-classification'
import { IComputationSheet } from '../computation-sheet'
import { ICurrency } from '../currency'
import { TFinancialStatementType } from '../financial-statement-definition'
import { TGeneralLedgerType } from '../general-ledger'
import { IMemberType } from '../member-type'
import {
    ACCOUNT_EXCLUSIVE_SETTING_TYPE,
    ACCOUNT_INTEREST_STANDARD_COMPUTATION,
    ACCOUNT_TYPE,
    COMPUTATION_TYPE,
    EARNED_UNEARNED_INTEREST,
    INTEREST_DEDUCTION,
    INTEREST_FINES_COMPUTATION_DIMINISHING,
    INTEREST_FINES_COMPUTATION_DIMINISHING_STRAIGHT_DIMINISHING_YEARLY,
    INTEREST_SAVING_TYPE_DIMINISHING_STRAIGHT,
    LOAN_SAVING_TYPE,
    LUMPSUM_COMPUTATION_TYPE,
    OTHER_DEDUCTION_ENTRY,
    OTHER_INFORMATION_OF_AN_ACCOUNT,
} from './account.constants'
import { TAccountFormValues } from './account.validation'

export type TAccountType = (typeof ACCOUNT_TYPE)[number]

export type TComputationType = (typeof COMPUTATION_TYPE)[number]

export type TLumpsumComputationType = (typeof LUMPSUM_COMPUTATION_TYPE)[number]

export type TInterestFinesComputationDiminishing =
    (typeof INTEREST_FINES_COMPUTATION_DIMINISHING)[number]

export type TInterestFinesComputationDiminishingStraightDiminishingYearly =
    (typeof INTEREST_FINES_COMPUTATION_DIMINISHING_STRAIGHT_DIMINISHING_YEARLY)[number]

export type TEarnedUnearnedInterest = (typeof EARNED_UNEARNED_INTEREST)[number]

export type TLoanSavingType = (typeof LOAN_SAVING_TYPE)[number]

export type TInterestDeduction = (typeof INTEREST_DEDUCTION)[number]

export type TOtherDeductionEntry = (typeof OTHER_DEDUCTION_ENTRY)[number]

export type TInterestSavingTypeDiminishingStraight =
    (typeof INTEREST_SAVING_TYPE_DIMINISHING_STRAIGHT)[number]

export type TOtherInformationOfAnAccount =
    (typeof OTHER_INFORMATION_OF_AN_ACCOUNT)[number]

export type TInterestStandardComputation =
    (typeof ACCOUNT_INTEREST_STANDARD_COMPUTATION)[number]

export type TAccountExclusiveSettingType =
    (typeof ACCOUNT_EXCLUSIVE_SETTING_TYPE)[number]

export interface IAccount extends IAuditable, ITimeStamps {
    id: TEntityId

    // GENERAL CONFIG
    index?: number
    is_internal?: boolean
    cash_on_hand?: boolean
    paid_up_share_capital?: boolean

    header_row?: number
    center_row?: number
    total_row?: number

    icon: TIcon
    name: string
    description?: string

    min_amount?: number
    max_amount?: number
    type: TAccountType

    member_type_id: TEntityId
    member_type: IMemberType

    cash_and_cash_equivalence: boolean

    compassion_fund: boolean // this is damayan in OLD coop
    compassion_fund_amount: number // this is damayan in OLD coop

    general_ledger_grouping_exclude_account?: boolean

    financial_statement_type?: TFinancialStatementType
    general_ledger_type: TGeneralLedgerType

    account_category_id?: TEntityId
    account_category?: IAccountCategory

    general_ledger_definition_id?: TEntityId
    financial_statement_definition_entries_id?: TEntityId

    account_classification_id?: TEntityId
    account_classification?: IAccountClassification

    // COMMON

    yearly_subscription_fee?: number

    show_in_general_ledger_source_withdraw: boolean
    show_in_general_ledger_source_deposit: boolean
    show_in_general_ledger_source_journal: boolean
    show_in_general_ledger_source_payment: boolean
    show_in_general_ledger_source_adjustment: boolean
    show_in_general_ledger_source_journal_voucher: boolean
    show_in_general_ledger_source_check_voucher: boolean

    // FOR LOAN
    // loan_cut_off_days?: number
    computation_sheet_id?: TEntityId
    computation_sheet?: IComputationSheet
    loan_saving_type?: TLoanSavingType
    lumpsum_computation_type?: TLumpsumComputationType

    other_deduction_entry?: TOtherDeductionEntry

    //  ALTCODE REPLACEMENT - Shows in (Interest, Fines, SVF (Service Fee))
    loan_account_id?: TEntityId
    loan_account?: IAccount

    // FOR CURRENCY
    currency_id: TEntityId
    currency?: ICurrency

    // FOR LOAN / INTEREST / FINES / SVF
    computation_type?: TComputationType

    // FOR FINES
    fines_amort?: number
    fines_maturity?: number

    fines_grace_period_amortization?: number
    additional_grace_period?: number

    fines_grace_period_maturity?: number

    no_grace_period_daily?: boolean

    interest_computation_month_end?: boolean
    fines_computation_by_next_amortization?: boolean
    computation_fines_lumpsum?: boolean
    fines_computation_daily_by_amortization?: boolean
    fines_computation_rest_by_rate?: boolean
    compute_fines_after_maturity?: boolean

    coh_cib_fines_grace_period_entry_daily_amortization?: number
    coh_cib_fines_grace_period_entry_daily_maturity?: number

    coh_cib_fines_grace_period_entry_weekly_amortization?: number
    coh_cib_fines_grace_period_entry_weekly_maturity?: number

    coh_cib_fines_grace_period_entry_monthly_amortization?: number
    coh_cib_fines_grace_period_entry_monthly_maturity?: number

    coh_cib_fines_grace_period_entry_semi_monthly_amortization?: number
    coh_cib_fines_grace_period_entry_semi_monthly_maturity?: number

    coh_cib_fines_grace_period_entry_quarterly_amortization?: number
    coh_cib_fines_grace_period_entry_quarterly_maturity?: number

    coh_cib_fines_grace_period_entry_semi_annual_amortization?: number
    coh_cib_fines_grace_period_entry_semi_annual_maturity?: number

    coh_cib_fines_grace_period_entry_annual_amortization?: number
    coh_cib_fines_grace_period_entry_annual_maturity?: number

    coh_cib_fines_grace_period_entry_lumpsum_amortization?: number
    coh_cib_fines_grace_period_entry_lumpsum_maturity?: number

    // FOR INTEREST
    interest_standard?: number
    interest_standard_computation?: TInterestStandardComputation

    cut_off_days?: number
    cut_off_months?: number

    earned_unearned_interest?: TEarnedUnearnedInterest
    interest_deduction?: TInterestDeduction

    interest_fines_computation_diminishing?: TInterestFinesComputationDiminishing
    interest_fines_computation_diminishing_straight_diminishing_yearly?: TInterestFinesComputationDiminishingStraightDiminishingYearly

    interest_saving_type_diminishing_straight?: TInterestSavingTypeDiminishingStraight
    other_information_of_an_account?: TOtherInformationOfAnAccount

    interest_diminishing_by_year?: boolean
}

// FOR US TO REMEMBER
// interest_secured?: number - WALA NATO DI NADAW GAGMITIN

export type IAccountRequest = TAccountFormValues

export interface IAccountPaginated extends IPaginatedResult<IAccount> {}

export type TPaginatedAccountHookMode =
    | 'withdraw'
    | 'deposit'
    | 'journal'
    | 'payment'
    | 'adjustment'
    | 'journal-voucher'
    | 'check-voucher'
    | 'loan'
    | 'loan-connectable-account-currency' // - This returns SVF, Interest, Fines accounts that can be connected to a loan account based on currency
    | 'cash-and-cash-equivalence'
    | 'currency'
    | 'currency-payment'
    | 'currency-cash-and-cash-equivalence'
    | 'currency-paid-up-shared-capital'
    | 'currency-loan' // - All loan accounts based on currency
    | 'all'

export type TDeleteAccountFromGLFSType = {
    id: TEntityId
    mode: string
}

export type TAccountComputationsheetConnect = {
    computation_sheet_id: TEntityId
    account_id: TEntityId
}

export type TAccountLoanConnect = {
    loan_account_id: TEntityId
    account_id: TEntityId
}

export type TGetAllAccountMode = 'all' | 'loan-account-connections'
