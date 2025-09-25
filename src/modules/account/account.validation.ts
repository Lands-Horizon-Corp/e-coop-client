import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

import { ACCOUNT_INTEREST_STANDARD_COMPUTATION } from './account.constants'
import {
    AccountExclusiveSettingTypeEnum,
    AccountTypeEnum,
    ComputationTypeEnum,
    EarnedUnearnedInterestEnum,
    FinancialStatementTypeEnum,
    GeneralLedgerTypeEnum,
    InterestDeductionEnum,
    InterestFinesComputationDiminishingEnum,
    InterestFinesComputationDiminishingStraightDiminishingYearlyEnum,
    InterestSavingTypeDiminishingStraightEnum,
    LoanSavingTypeEnum,
    LumpsumComputationTypeEnum,
    OtherDeductionEntryEnum,
    OtherInformationOfAnAccountEnum,
} from './account.types'

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
        .enum(AccountExclusiveSettingTypeEnum)
        .default(AccountExclusiveSettingTypeEnum.None),

    interest_standard_computation: z
        .enum(ACCOUNT_INTEREST_STANDARD_COMPUTATION)
        .default('None'),

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
export type TAccountFormValues = z.infer<typeof IAccountRequestSchema>
