import z from 'zod'

import { TIcon } from '@/components/icons'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import {
    AccountTypeEnum,
    ComputationTypeEnum,
    EarnedUnearnedInterestEnum,
    IAccount,
    InterestDeductionEnum,
    InterestFinesComputationDiminishingEnum,
    InterestFinesComputationDiminishingStraightDiminishingYearlyEnum,
    InterestSavingTypeDiminishingStraightEnum,
    InterestStandardComputationEnum,
    LoanSavingTypeEnum,
    LumpsumComputationTypeEnum,
    OtherDeductionEntryEnum,
    OtherInformationOfAnAccountEnum,
} from '../account/account.types'
import { FinancialStatementTypeEnum } from '../financial-statement-definition'
import { GeneralLedgerTypeEnum } from '../general-ledger-definition'
import { AccountHistorySchema } from './account-history.validation'

export enum HistoryChangeTypeEnum {
    Created = 'created',
    Updated = 'updated',
    Deleted = 'deleted',
}

export interface IAccountHistory extends IBaseEntityMeta {
    id: TEntityId

    account_id: TEntityId
    account?: IAccount

    change_type: HistoryChangeTypeEnum
    valid_from: string
    valid_to?: string
    change_reason?: string
    changed_fields?: string

    name: string
    description: string
    type: AccountTypeEnum
    min_amount: number
    max_amount: number
    index: number

    is_internal: boolean
    cash_on_hand: boolean
    paid_up_share_capital: boolean

    computation_type: ComputationTypeEnum

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

    lumpsum_computation_type: LumpsumComputationTypeEnum
    interest_fines_computation_diminishing: InterestFinesComputationDiminishingEnum
    interest_fines_computation_diminishing_straight_yearly: InterestFinesComputationDiminishingStraightDiminishingYearlyEnum
    earned_unearned_interest: EarnedUnearnedInterestEnum
    loan_saving_type: LoanSavingTypeEnum
    interest_deduction: InterestDeductionEnum
    other_deduction_entry: OtherDeductionEntryEnum
    interest_saving_type_diminishing_straight: InterestSavingTypeDiminishingStraightEnum
    other_information_of_an_account: OtherInformationOfAnAccountEnum

    financial_statement_type: FinancialStatementTypeEnum
    general_ledger_type: GeneralLedgerTypeEnum

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

    interest_standard_computation: InterestStandardComputationEnum

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
