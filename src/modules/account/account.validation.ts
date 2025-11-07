import z from 'zod'

import { ICONS } from '@/constants'
import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

import { FINANCIAL_STATEMENT_TYPE } from '../financial-statement-definition'
import { GENERAL_LEDGER_TYPE } from '../general-ledger'
import {
    ACCOUNT_EXCLUSIVE_SETTING_TYPE,
    ACCOUNT_INTEREST_STANDARD_COMPUTATION,
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

// Reusable computation type schema
export const AccountComputationTypeSchema = z
    .enum(COMPUTATION_TYPE, {
        message: 'Invalid computation type',
    })
    .default('Diminishing')

// Discriminated union for account types
const AccountTypeDiscriminator = z.discriminatedUnion('type', [
    // Loan account - requires computation_type

    // Other account types - computation_type is optional
    z.object({
        type: z.literal('Other'),
    }),

    z.object({
        type: z.literal('Deposit'),
    }),

    z.object({
        type: z.literal('A/R-Ledger'),
    }),

    z.object({
        type: z.literal('A/R-Aging'),
    }),

    z.object({
        type: z.literal('SVF-Ledger'),

        min_amount: z.coerce
            .number()
            .min(0, 'Min amount must be non-negative')
            .optional(),
        max_amount: z.coerce
            .number()
            .min(0, 'Max amount must be non-negative')
            .optional(),

        computation_type: AccountComputationTypeSchema.optional(),
        interest_standard: z
            .number()
            .min(0, 'Interest standard must be non-negative')
            .optional(),
    }),

    z.object({
        type: z.literal('W-Off'),
    }),

    z.object({
        type: z.literal('A/P-Ledger'),
    }),

    z.object({
        type: z.literal('Loan'),
        // computation_type: AccountComputationTypeSchema,
        loan_saving_type: z
            .enum(LOAN_SAVING_TYPE, { error: 'Invalid loan saving type' })
            .optional(),
        other_deduction_entry: z
            .enum(OTHER_DEDUCTION_ENTRY, { error: 'Invalid other deduction' })
            .optional(),
        computation_sheet_id: entityIdSchema.optional(),
    }),

    // Fines account - has specific fields
    z.object({
        type: z.literal('Fines'),
        // computation_type: AccountComputationTypeSchema.optional(),

        //  ALTCODE REPLACEMENT
        loan_account_id: entityIdSchema.optional(),
        loan_account: z.any().optional(),

        fines_amort: z
            .number()
            .min(0, 'Fines amort must be non-negative')
            .optional(),
        fines_maturity: z
            .number()
            .min(0, 'Fines maturity must be non-negative')
            .optional(),
        fines_grace_period_amortization: z
            .number()
            .min(0, 'Fines grace period amortization must be non-negative')
            .optional(),
        additional_grace_period: z
            .number()
            .int()
            .min(0, 'Additional grace period must be non-negative')
            .optional(),
        fines_grace_period_maturity: z
            .number()
            .min(0, 'Fines grace period maturity must be non-negative')
            .optional(),

        interest_computation_month_end: z.boolean().optional(),
        fines_computation_by_next_amortization: z.boolean().optional(),
        computation_fines_lumpsum: z.boolean().optional(),
        fines_computation_daily_by_amortization: z.boolean().optional(),
        fines_computation_rest_by_rate: z.boolean().optional(),
        compute_fines_after_maturity: z.boolean().optional(),
    }),

    // Interest account - has specific fields
    z.object({
        type: z.literal('Interest'),

        min_amount: z.coerce
            .number()
            .min(0, 'Min amount must be non-negative')
            .optional(),
        max_amount: z.coerce
            .number()
            .min(0, 'Max amount must be non-negative')
            .optional(),

        computation_type: AccountComputationTypeSchema.optional(),
        interest_standard: z
            .number()
            .min(0, 'Interest standard must be non-negative')
            .optional(),

        cut_off_days: z.coerce.number().int().min(1).max(31).optional(),
        cut_off_months: z.coerce.number().int().min(0).max(31).optional(),

        interest_fines_computation_diminishing: z
            .enum(INTEREST_FINES_COMPUTATION_DIMINISHING, {
                error: 'Invalid option',
            })
            .optional(),

        interest_deduction: z
            .enum(INTEREST_DEDUCTION, { error: 'Invalid interest deduction' })
            .optional(),

        interest_fines_computation_diminishing_straight_diminishing_yearly: z
            .enum(
                INTEREST_FINES_COMPUTATION_DIMINISHING_STRAIGHT_DIMINISHING_YEARLY,
                {
                    error: 'Invalid option',
                }
            )
            .optional(),

        earned_unearned_interest: z
            .enum(EARNED_UNEARNED_INTEREST, { error: 'Invalid option' })
            .optional(),

        interest_saving_type_diminishing_straight: z
            .enum(INTEREST_SAVING_TYPE_DIMINISHING_STRAIGHT, {
                error: 'Invalid option',
            })
            .optional(),
    }),
])

// Base schema with common fields
export const IAccountRequestSchema = z
    .object({
        id: entityIdSchema.optional(),

        // GENERAL CONFIG
        index: z.coerce
            .number()
            .min(0, 'Index must be non-negative integer')
            .optional(),
        is_internal: z.boolean().optional(),
        cash_on_hand: z.boolean().optional(),
        paid_up_share_capital: z.boolean().optional(),

        header_row: z.coerce.number().int().optional(),
        center_row: z.coerce.number().int().optional(),
        total_row: z.coerce.number().int().optional(),

        cash_and_cash_equivalence: z.boolean().default(false),

        compassion_fund: z.boolean().default(false),
        compassion_fund_amount: z.coerce
            .number()
            .min(0, 'Negative amount is not allowed')
            .default(0),

        general_ledger_grouping_exclude_account: z.boolean().optional(),

        name: z.string().min(1, 'Name is required'),
        description: z
            .string()
            .max(250, 'Maximum is 250')
            .optional()
            .transform(descriptionTransformerSanitizer),

        icon: z.enum(ICONS, { error: 'Invalid icon' }).default('Money'),
        member_type_id: entityIdSchema.optional(),

        financial_statement_type: z
            .enum(FINANCIAL_STATEMENT_TYPE, {
                error: 'Invalid financial statement type',
            })
            .optional(),
        general_ledger_type: z.enum(GENERAL_LEDGER_TYPE, {
            error: 'Invalid option',
        }),

        account_category_id: entityIdSchema.optional(),

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

        general_ledger_definition_id: entityIdSchema.optional(),
        financial_statement_definition_entries_id: entityIdSchema.optional(),

        account_classification_id: entityIdSchema.optional(),
        other_information_of_an_account: z
            .enum(OTHER_INFORMATION_OF_AN_ACCOUNT, { error: 'Invalid option' })
            .optional(),

        // COMMON
        // account_exclusive_setting_type: z
        //     .enum(ACCOUNT_EXCLUSIVE_SETTING_TYPE)
        //     .default('None'),

        show_in_general_ledger_source_check_voucher: z.boolean().default(true),
        show_in_general_ledger_source_withdraw: z.boolean().default(true),
        show_in_general_ledger_source_deposit: z.boolean().default(true),
        show_in_general_ledger_source_journal: z.boolean().default(true),
        show_in_general_ledger_source_payment: z.boolean().default(true),
        show_in_general_ledger_source_adjustment: z.boolean().default(true),
        show_in_general_ledger_source_journal_voucher: z
            .boolean()
            .default(true),

        //  ALTCODE REPLACEMENT
        loan_account_id: entityIdSchema.optional(),
        loan_account: z.any().optional(),

        // FOR CURRENCY
        currency_id: entityIdSchema.optional(),
        currency: z.any(),

        // FOR COMMON INTEREST
        interest_standard_computation: z
            .enum(ACCOUNT_INTEREST_STANDARD_COMPUTATION, {
                error: 'Invalid computation option',
            })
            .default('None'),

        // COMMON FINES
        no_grace_period_daily: z.boolean().optional(),

        // FOR COMMON LOAN
        yearly_subscription_fee: z.coerce.number().min(0).optional(),
        loan_cut_off_days: z.coerce.number().int().min(-1).optional(),

        lumpsum_computation_type: z
            .enum(LUMPSUM_COMPUTATION_TYPE, {
                error: 'Invalid lumpsum computation type',
            })
            .optional(),

        account_exclusive_setting_type: z
            .enum(ACCOUNT_EXCLUSIVE_SETTING_TYPE, {
                error: 'Invalid account exclusive setting type',
            })
            .default('None'),

        interest_diminishing_by_year: z.boolean().optional().default(false),
    })
    .and(AccountTypeDiscriminator)

export type TAccountFormValues = z.infer<typeof IAccountRequestSchema>
