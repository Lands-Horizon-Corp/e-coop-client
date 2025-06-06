import {
    AccountTypeEnum,
    ComputationTypeEnum,
    LumpsumComputationTypeEnum,
    InterestFinesComputationDiminishingEnum,
    InterestFinesComputationDiminishingStraightDiminishingYearlyEnum,
    EarnedUnearnedInterestEnum,
    LoanSavingTypeEnum,
    InterestDeductionEnum,
    OtherDeductionEntryEnum,
    InterestSavingTypeDiminishingStraightEnum,
    OtherInformationOfAnAccountEnum,
} from '@/types/coop-types/accounts/account'
import { FinancialStatementTypeEnum } from '@/types/coop-types/financial-statement-definition'
import { GeneralLedgerTypeEnum } from '@/types/coop-types/general-ledger-definitions'
import z from 'zod'

const TEntityIdSchema = z.string()

export enum AccountExclusiveSettingTypeEnum {
    None = 'None',
    IsInternal = 'IsInternal',
    CashOnHand = 'CashOnHand',
    PaidUpShareCapital = 'PaidUpShareCapital',
}

export const IAccountRequestSchema = z.object({
    organization_id: TEntityIdSchema.optional(),
    branch_id: TEntityIdSchema.optional(),

    general_ledger_definition_id: TEntityIdSchema.optional(),
    financial_statement_definition_id: TEntityIdSchema.optional(),
    account_classification_id: TEntityIdSchema.optional(),
    account_category_id: TEntityIdSchema.optional(),
    member_type_id: TEntityIdSchema,

    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),

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

    computation_type: z.nativeEnum(ComputationTypeEnum).optional(),

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

    computation_sheet_id: TEntityIdSchema.optional(),

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

    financial_statement_type: z
        .nativeEnum(FinancialStatementTypeEnum)
        .optional(),
    general_ledger_type: z.nativeEnum(GeneralLedgerTypeEnum).optional(),

    alternative_code: z.string().optional(),

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
})

// const validAccountData = {
//     id: 'acc_123',
//     organization_id: 'org_abc',
//     branch_id: 'br_main',
//     member_type_id: 'mt_001',
//     name: 'Savings Account',
//     description: 'Standard savings account for members.',
//     type: AccountTypeEnum.Deposit,
//     minAmount: 100,
//     maxAmount: 100000,
//     is_internal: false,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
// }

// try {
//     console.log('Valid IAccount data:', validAccountData)
// } catch (error) {
//     console.error('IAccount validation error:', error)
// }

// const invalidAccountData = {
//     id: 'acc_456',
//     member_type_id: 'mt_002',
//     description: 'Invalid account example.',
//     type: AccountTypeEnum.Loan,
// }

// try {
//     console.log('Valid IAccount data (should not be):', invalidAccountData)
// } catch (error) {
//     console.error('IAccount validation error (expected):', error)
// }

// const validAccountRequestData = {
//     member_type_id: 'mt_003',
//     name: 'New Loan Product',
//     description: 'A new loan offering.',
//     type: AccountTypeEnum.Loan,
//     computation_type: ComputationTypeEnum.Straight,
//     interest_standard: 0.05,
//     organization_id: 'org_xyz',
//     branch_id: 'br_east',
// }

// try {
//     IAccountRequestSchema.parse(validAccountRequestData)
//     console.log('Valid IAccountRequest data:', validAccountRequestData)
// } catch (error) {
//     console.error('IAccountRequest validation error:', error)
// }
