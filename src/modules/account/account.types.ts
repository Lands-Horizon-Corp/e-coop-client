import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

export enum AccountTypeEnum {
    Other = 'Other',
    Deposit = 'Deposit',
    Loan = 'Loan',
    ARLedger = 'A/R-Ledger',
    ARAging = 'A/R-Aging',
    Fines = 'Fines',
    Interest = 'Interest',
    SVFLedger = 'SVF-Ledger',
    WOff = 'W-Off',
    APLedger = 'A/P-Ledger',
}

export enum ComputationTypeEnum {
    Straight = 'Straight',
    Diminishing = 'Diminishing',
    DiminishingAddOn = 'DiminishingAddOn',
    DiminishingYearly = 'DiminishingYearly',
    DiminishingStraight = 'DiminishingStraight',
    DiminishingQuarterly = 'DiminishingQuarterly',
}

export enum FinancialStatementTypeEnum {
    Assets = 'Assets',
    Liabilities = 'Liabilities',
    Equity = 'Equity',
    Revenue = 'Revenue',
    Expenses = 'Expenses',
}

export enum GeneralLedgerTypeEnum {
    Assets = 'Assets',
    LiabilitiesEquityAndReserves = 'Liabilities, Equity & Reserves',
    Income = 'Income',
    Expenses = 'Expenses',
}

export enum LumpsumComputationTypeEnum {
    None = 'None',
    ComputeFinesMaturity = 'Compute Fines Maturity',
    ComputeInterestMaturityTerms = 'Compute Interest Maturity / Terms',
    ComputeAdvanceInterest = 'Compute Advance Interest',
}

export enum InterestFinesComputationDiminishingEnum {
    None = 'None',
    ByAmortization = 'By Amortization',
    ByAmortizationDailyOnInterestPrincipalInterestFinesArr = 'By Amortization Daly on Interest Principal + Interest = Fines(Arr)',
}

export enum InterestFinesComputationDiminishingStraightDiminishingYearlyEnum {
    None = 'None',
    ByDailyOnInterestBasedOnLoanBalanceByYearPrincipalInterestAmortizationFinesFinesGracePeriodMonthEndAmortization = 'By Daily on Interest based on loan balance by year Principal + Interest Amortization = Fines Fines Grace Period Month end Amortization',
}

export enum EarnedUnearnedInterestEnum {
    None = 'None',
    ByFormula = 'By Formula',
    ByFormulaActualPay = 'By Formula + Actual Pay',
    ByAdvanceInterestActualPay = 'By Advance Interest + Actual Pay',
}

export enum LoanSavingTypeEnum {
    Separate = 'Separate',
    SingleLedger = 'Single Ledger',
    SingleLedgerIfNotZero = 'Single Ledger if Not Zero',
    SingleLedgerSemi1530 = 'Single Ledger Semi (15/30)',
    SingleLedgerSemiWithinMaturity = 'Single Ledger Semi Within Maturity',
}

export enum InterestDeductionEnum {
    Above = 'Above',
    Below = 'Below',
}

export enum OtherDeductionEntryEnum {
    None = 'None',
    HealthCare = 'Health Care',
}

export enum InterestSavingTypeDiminishingStraightEnum {
    Spread = 'Spread',
    FirstPayment = '1st Payment',
}

export enum OtherInformationOfAnAccountEnum {
    None = 'None',
    Jewelry = 'Jewelry',
    Grocery = 'Grocery',
    TrackLoanDeduction = 'Track Loan Deduction',
    Restructured = 'Restructured',
    CashInBankCashInCheckAccount = 'Cash in Bank / Cash in Check Account',
    CashOnHand = 'Cash on Hand',
}

export interface IAccount extends IAuditable, ITimeStamps {
    id: TEntityId

    organization_id?: TEntityId
    branch_id?: TEntityId

    general_ledger_definition_id?: TEntityId
    financial_statement_definition_entries_id?: TEntityId
    account_classification_id?: TEntityId
    account_category_id?: TEntityId
    member_type_id: TEntityId

    name: string
    description?: string

    minAmount?: number
    maxAmount?: number
    index?: number
    type: AccountTypeEnum

    is_internal?: boolean
    cash_on_hand?: boolean
    paid_up_share_capital?: boolean

    computation_type?: ComputationTypeEnum

    fines_amort?: number
    fines_maturity?: number

    interest_standard?: number
    interest_secured?: number

    computation_sheet_id?: TEntityId

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

    coh_cib_fines_grace_period_entry_semi_anual_amortization?: number
    coh_cib_fines_grace_period_entry_semi_anual_maturity?: number

    coh_cib_fines_grace_period_entry_lumpsum_amortization?: number
    coh_cib_fines_grace_period_entry_lumpsum_maturity?: number

    financial_statement_type?: FinancialStatementTypeEnum
    general_ledger_type?: GeneralLedgerTypeEnum

    alternative_code?: string

    fines_grace_period_amortization?: number
    additional_grace_period?: number
    // cut_off_days
    // cut_off_months

    number_grace_period_daily?: boolean

    fines_grace_period_maturity?: number
    yearly_subscription_fee?: number
    loan_cut_off_days?: number

    lumpsum_computation_type?: LumpsumComputationTypeEnum
    interest_fines_computation_diminishing?: InterestFinesComputationDiminishingEnum
    interest_fines_computation_diminishing_straight_diminishing_yearly?: InterestFinesComputationDiminishingStraightDiminishingYearlyEnum
    earned_unearned_interest?: EarnedUnearnedInterestEnum
    loan_saving_type?: LoanSavingTypeEnum
    interest_deduction?: InterestDeductionEnum
    other_deduction_entry?: OtherDeductionEntryEnum
    interest_saving_type_diminishing_straight?: InterestSavingTypeDiminishingStraightEnum
    other_information_of_an_account?: OtherInformationOfAnAccountEnum

    header_row?: number
    center_row?: number
    total_row?: number

    general_ledger_grouping_exclude_account?: boolean

    icon: string
    show_in_general_ledger_source_withdraw: boolean
    show_in_general_ledger_source_deposit: boolean
    show_in_general_ledger_source_journal: boolean
    show_in_general_ledger_source_payment: boolean
    show_in_general_ledger_source_adjustment: boolean
    show_in_general_ledger_source_journal_voucher: boolean
    show_in_general_ledger_source_check_voucher: boolean

    compassion_fund: boolean // this is damayan in OLD coop
    compassion_fund_amount: number // this is damayan in OLD coop
}

export interface IAccountRequest {
    organization_id: TEntityId
    branch_id: TEntityId

    general_ledger_definition_id?: TEntityId
    financial_statement_definition_entries_id?: TEntityId
    account_classification_id?: TEntityId
    account_category_id?: TEntityId
    member_type_id?: TEntityId

    name: string
    description?: string

    minAmount?: number
    maxAmount?: number
    index?: number
    type: AccountTypeEnum

    is_internal?: boolean
    cash_on_hand?: boolean
    paid_up_share_capital?: boolean

    computation_type?: ComputationTypeEnum

    fines_amort?: number
    fines_maturity?: number
    interest_standard?: number
    interest_secured?: number

    computation_sheet_id?: TEntityId

    coh_cib_fines_grace_period_entry_cash_hand?: number
    coh_cib_fines_grace_period_entry_cash_in_bank?: number

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
    coh_cib_fines_grace_period_entry_semi_anual_amortization?: number
    coh_cib_fines_grace_period_entry_semi_anual_maturity?: number
    coh_cib_fines_grace_period_entry_lumpsum_amortization?: number
    coh_cib_fines_grace_period_entry_lumpsum_maturity?: number

    financial_statement_type?: FinancialStatementTypeEnum
    general_ledger_type?: GeneralLedgerTypeEnum

    alternative_code?: string

    fines_grace_period_amortization?: number
    additional_grace_period?: number
    number_grace_period_daily?: boolean
    fines_grace_period_maturity?: number
    yearly_subscription_fee?: number
    loan_cut_off_days?: number

    lumpsum_computation_type?: LumpsumComputationTypeEnum
    interest_fines_computation_diminishing?: InterestFinesComputationDiminishingEnum

    interest_fines_computation_diminishing_straight_diminishing_yearly?: InterestFinesComputationDiminishingStraightDiminishingYearlyEnum
    earned_unearned_interest?: EarnedUnearnedInterestEnum
    loan_saving_type?: LoanSavingTypeEnum
    interest_deduction?: InterestDeductionEnum
    other_deduction_entry?: OtherDeductionEntryEnum
    interest_saving_type_diminishing_straight?: InterestSavingTypeDiminishingStraightEnum
    other_information_of_an_account?: OtherInformationOfAnAccountEnum

    header_row?: number
    center_row?: number
    total_row?: number

    general_ledger_grouping_exclude_account?: boolean

    icon: string
    show_in_general_ledger_source_withdraw: boolean
    show_in_general_ledger_source_deposit: boolean
    show_in_general_ledger_source_journal: boolean
    show_in_general_ledger_source_payment: boolean
    show_in_general_ledger_source_adjustment: boolean
    show_in_general_ledger_source_journal_voucher: boolean
    show_in_general_ledger_source_check_voucher: boolean

    compassion_fund: boolean // this is damayan in OLD coop
    compassion_fund_amount: number // this is damayan in OLD coop
}

export interface IAccountPaginated extends IPaginatedResult<IAccount> {}

export enum AccountExclusiveSettingTypeEnum {
    None = 'None',
    IsInternal = 'Is Internal',
    CashOnHand = 'Cash on Hand',
    PaidUpShareCapital = 'Paid up share capital',
}

export type TPaginatedAccountHookMode =
    | 'withdraw'
    | 'deposit'
    | 'journal'
    | 'payment'
    | 'adjustment'
    | 'journal-voucher'
    | 'check-voucher'
    | 'loan'
    | 'cash-and-cash-equivalence'

export type TDeleteAccountFromGLFSType = {
    id: TEntityId
    mode: string
}
