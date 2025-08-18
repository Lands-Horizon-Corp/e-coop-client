import z from 'zod'

import { IAuditable, IPaginatedResult, ITimeStamps, TEntityId } from '../common'
import { descriptionTransformerSanitizer, entityIdSchema } from '../common'

// import { FinancialStatementTypeEnum } from '@/types/coop-types/financial-statement-definition'
// import { GeneralLedgerTypeEnum } from '@/types/coop-types/general-ledger-definitions'

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
    DiminishingAddOn = 'Diminishing Add-On',
    DiminishingYearly = 'Diminishing Yearly',
    DiminishingStraight = 'Diminishing Straight',
    DiminishingQuarterly = 'Diminishing Quarterly',
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

export const IAccountRequestSchema = z.object({
    general_ledger_definition_id: entityIdSchema.optional(),
    financial_statement_definition_entries_id: entityIdSchema.optional(),
    account_classification_id: entityIdSchema.optional(),
    account_category_id: entityIdSchema.optional(),
    member_type_id: entityIdSchema.optional(),

    name: z.string().min(1, 'Name is required'),
    description: z
        .string()
        .max(250, 'Maximum is 250')
        .optional()
        .transform(descriptionTransformerSanitizer),

    minAmount: z.number().min(0, 'Min amount must be non-negative').optional(),
    maxAmount: z.number().min(0, 'Max amount must be non-negative').optional(),
    index: z.coerce
        .number()
        .min(0, 'Index must be non-negative integer')
        .optional(),
    type: z.nativeEnum(AccountTypeEnum),

    account_exclusive_setting_type: z
        .nativeEnum(AccountExclusiveSettingTypeEnum)
        .default(AccountExclusiveSettingTypeEnum.None),

    computation_type: z.preprocess(
        (val) => (val === '' || val === null ? undefined : val),
        z.nativeEnum(ComputationTypeEnum).optional()
    ),
    fines_amort: z
        .number()
        .min(0, 'Fines amort must be non-negative')
        .optional(),
    fines_maturity: z
        .number()
        .min(0, 'Fines maturity must be non-negative')
        .optional(),

    interest_standard: z
        .number()
        .min(0, 'Interest standard must be non-negative')
        .optional(),
    interest_secured: z
        .number()
        .min(0, 'Interest secured must be non-negative')
        .optional(),

    computation_sheet_id: entityIdSchema.optional(),

    coh_cib_fines_grace_period_entry_daily_amortization: z
        .number()
        .min(0)
        .optional(),
    coh_cib_fines_grace_period_entry_daily_maturity: z
        .number()
        .min(0)
        .optional(),
    coh_cib_fines_grace_period_entry_weekly_amortization: z
        .number()
        .min(0)
        .optional(),
    coh_cib_fines_grace_period_entry_weekly_maturity: z
        .number()
        .min(0)
        .optional(),
    coh_cib_fines_grace_period_entry_monthly_amortization: z
        .number()
        .min(0)
        .optional(),
    coh_cib_fines_grace_period_entry_monthly_maturity: z
        .number()
        .min(0)
        .optional(),
    coh_cib_fines_grace_period_entry_semi_monthly_amortization: z
        .number()
        .min(0)
        .optional(),
    coh_cib_fines_grace_period_entry_semi_monthly_maturity: z
        .number()
        .min(0)
        .optional(),
    coh_cib_fines_grace_period_entry_quarterly_amortization: z
        .number()
        .min(0)
        .optional(),
    coh_cib_fines_grace_period_entry_quarterly_maturity: z
        .number()
        .min(0)
        .optional(),
    coh_cib_fines_grace_period_entry_semi_anual_amortization: z
        .number()
        .min(0)
        .optional(),
    coh_cib_fines_grace_period_entry_semi_anual_maturity: z
        .number()
        .min(0)
        .optional(),
    coh_cib_fines_grace_period_entry_lumpsum_amortization: z
        .number()
        .min(0)
        .optional(),
    coh_cib_fines_grace_period_entry_lumpsum_maturity: z
        .number()
        .min(0)
        .optional(),

    financial_statement_type: z.nativeEnum(FinancialStatementTypeEnum),
    general_ledger_type: z.nativeEnum(GeneralLedgerTypeEnum),

    alternative_code: z.string().optional().default(''),

    fines_grace_period_amortization: z.number().int().min(0).optional(),
    additional_grace_period: z.number().int().min(0).optional(),
    number_grace_period_daily: z.boolean().optional(),
    fines_grace_period_maturity: z.number().int().min(0).optional(),
    yearly_subscription_fee: z.number().min(0).optional(),
    loan_cut_off_days: z.number().int().min(0).optional(),

    lumpsum_computation_type: z
        .nativeEnum(LumpsumComputationTypeEnum)
        .optional(),
    interest_fines_computation_diminishing: z
        .nativeEnum(InterestFinesComputationDiminishingEnum)
        .optional(),
    interest_fines_computation_diminishing_straight_diminishing_yearly: z
        .nativeEnum(
            InterestFinesComputationDiminishingStraightDiminishingYearlyEnum
        )
        .optional(),
    earned_unearned_interest: z
        .nativeEnum(EarnedUnearnedInterestEnum)
        .optional(),
    loan_saving_type: z.nativeEnum(LoanSavingTypeEnum).optional(),
    interest_deduction: z.nativeEnum(InterestDeductionEnum).optional(),
    other_deduction_entry: z.nativeEnum(OtherDeductionEntryEnum).optional(),
    interest_saving_type_diminishing_straight: z
        .nativeEnum(InterestSavingTypeDiminishingStraightEnum)
        .optional(),
    other_information_of_an_account: z
        .nativeEnum(OtherInformationOfAnAccountEnum)
        .optional(),

    header_row: z.number().int().optional(),
    center_row: z.number().int().optional(),
    total_row: z.number().int().optional(),

    general_ledger_grouping_exclude_account: z.boolean().optional(),

    icon: z.string().default(''),
    show_in_general_ledger_source_withdraw: z.boolean().default(true),
    show_in_general_ledger_source_deposit: z.boolean().default(true),
    show_in_general_ledger_source_journal: z.boolean().default(true),
    show_in_general_ledger_source_payment: z.boolean().default(true),
    show_in_general_ledger_source_adjustment: z.boolean().default(true),
    show_in_general_ledger_source_journal_voucher: z.boolean().default(true),
    show_in_general_ledger_source_check_voucher: z.boolean().default(true),

    compassion_fund: z.boolean().default(false), // this is damayan in OLD coop
    compassion_fund_amount: z.coerce
        .number()
        .min(0, 'Negative amount is not allowed')
        .default(0), // this is damayan in OLD coop
})
