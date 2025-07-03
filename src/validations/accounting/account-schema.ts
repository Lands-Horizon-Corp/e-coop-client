import z from 'zod'

import {
    AccountTypeEnum,
    ComputationTypeEnum,
    EarnedUnearnedInterestEnum,
    InterestDeductionEnum,
    InterestFinesComputationDiminishingEnum,
    InterestFinesComputationDiminishingStraightDiminishingYearlyEnum,
    InterestSavingTypeDiminishingStraightEnum,
    LoanSavingTypeEnum,
    LumpsumComputationTypeEnum,
    OtherDeductionEntryEnum,
    OtherInformationOfAnAccountEnum,
} from '@/types/coop-types/accounts/account'
import { FinancialStatementTypeEnum } from '@/types/coop-types/financial-statement-definition'
import { GeneralLedgerTypeEnum } from '@/types/coop-types/general-ledger-definitions'

import { entityIdSchema } from '../common'

export enum AccountExclusiveSettingTypeEnum {
    None = 'None',
    IsInternal = 'Is Internal',
    CashOnHand = 'Cash on Hand',
    PaidUpShareCapital = 'Paid up share capital',
}

export const IAccountRequestSchema = z.object({
    general_ledger_definition_id: entityIdSchema.optional(),
    financial_statement_definition_id: entityIdSchema.optional(),
    account_classification_id: entityIdSchema.optional(),
    account_category_id: entityIdSchema.optional(),
    member_type_id: entityIdSchema.optional(),

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
