import { z } from 'zod'

import {
    MonthSchema,
    YearSchema,
    entityIdSchema,
    stringDateWithTransformSchema,
} from '@/validation'

import { GENERAL_LEDGER_TYPE } from '../general-ledger/general-ledger.constants'
import { GeneralLedgerSourceSchema } from '../general-ledger/general-ledger.validation'
import { WithGeneratedReportSchema } from '../generated-report'

export const GeneralLedgerTypeEnumSchema = z.enum(GENERAL_LEDGER_TYPE)

export const GeneralLedgerDefinitionSchema = z.object({
    general_ledger_definition_entry_id: entityIdSchema.optional(),

    name: z.string().min(1, 'The name is Required!'),
    description: z.string().optional(),
    index: z.coerce.number().optional(),
    name_in_total: z.string().min(1, 'Name in total is required'),

    is_posting: z.boolean().optional().default(false),
    general_ledger_type: GeneralLedgerTypeEnumSchema,

    beginning_balance_of_the_year_credit: z.coerce.number().optional(),
    beginning_balance_of_the_year_debit: z.coerce.number().optional(),
    budget_forecasting_of_the_year_percent: z.coerce.number().optional(),

    past_due: z.string().optional(),
    in_litigation: z.string().optional(),
})

export const GLCloseBookSchema = z.object({
    year: z.coerce
        .number()
        .min(1900, 'Year is invalid')
        .max(3000, 'Year is invalid'),
})

export type IGLCloseBookFormValues = z.infer<typeof GLCloseBookSchema>

export const GLPostSchema = z.object({
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),

    is_unpost: z.boolean().optional().default(false),
})

export type IGLPostFormValues = z.infer<typeof GLPostSchema>

export const FSAccountTypeEnumSchema = z.enum([
    'standard',
    'group_title',
    'group_total',
    'sub_group_title',
    'sub_group_total',
    'header_total',
])

export const FSTitleMarginEnumSchema = z.enum([
    'indent1',
    'indent2',
    'left',
    'center',
    'left_right',
])

export const FSAccountSchema = z.object({
    account_code: z.string().min(1, 'Account code is required'),

    account_title: z.string().min(1, 'Account title is required'),

    type: FSAccountTypeEnumSchema.default('standard'),

    title_margin: FSTitleMarginEnumSchema.default('indent1'),

    exclude_consolidated: z.boolean().optional().default(false),
})

export type IFSAccountFormValues = z.infer<typeof FSAccountSchema>

export type IGeneralLedgerDefinitionFormValues = z.infer<
    typeof GeneralLedgerDefinitionSchema
>

// FOR REPORTS

// REPORT ACCT LEDGER
export const AccountLedgerReport = z
    .object({
        accounts: z.any(), // ONLY FOR UI
        account_ids: z
            .array(entityIdSchema)
            .min(1, 'at least one account selected'),

        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        report_type: z.enum(['detailed', 'summary']).default('detailed'),
        is_account_per_page: z.boolean().optional().default(false),
    })
    .and(WithGeneratedReportSchema)
    .superRefine((data, ctx) => {
        if (data.start_date !== undefined && data.end_date !== undefined) {
            if (data.start_date > data.end_date) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Start Date must not be past of End Date',
                    path: ['start_date'],
                })
                ctx.addIssue({
                    code: 'custom',
                    message: 'To Date must be earlier than Start Date',
                    path: ['end_date'],
                })
            }
        }
    })

export type TAccountLedgerReportSchema = z.infer<typeof AccountLedgerReport>

// ACCOUNT HISTORY REPORT
export const AccountHistoryReportSchema = z
    .object({
        accounts: z.any(),
        account_ids: z
            .array(entityIdSchema)
            .min(1, 'at least one account selected'),

        sort_by: z.enum(['by_date', 'by_cv_no', 'none']).default('by_date'),

        member_id: entityIdSchema.optional(),
        member: z.any().optional(),

        source: GeneralLedgerSourceSchema.default('payment'),
    })
    .and(WithGeneratedReportSchema)

export type TAccountHistoryReportSchema = z.infer<
    typeof AccountHistoryReportSchema
>

// INCOME STATEMENT VALIDATION
export const IncomeStatementReportSchema = z
    .object({
        month: MonthSchema,
        year: z.number().min(1900, 'Year must be 19000 or later'),

        report_type: z
            .enum([
                'standard',
                'comparative_monthly',
                'comparative_yearly',
                'closed_book',
                'budget_forecasted',
            ])
            .default('standard'),

        include_previous_year: z.boolean().optional().default(false),
    })
    .and(WithGeneratedReportSchema)

export type TIncomeStatementReportSchema = z.infer<
    typeof IncomeStatementReportSchema
>

// BALANCE SHEET VALIDATION REPORT
export const BalanceSheetReportSchema = z
    .object({
        month: MonthSchema,
        year: YearSchema,

        report_type: z
            .enum([
                'standard',
                'comparative_monthly',
                'comparative_yearly',
                'closed_book',
                'budget_forecasting',
            ])
            .default('standard'),

        as_of_previous_year: z.boolean().optional().default(false),
        sort_by_link_code: z.boolean().optional().default(false),
    })
    .and(WithGeneratedReportSchema)

export type TBalanceSheetReportSchema = z.infer<typeof BalanceSheetReportSchema>

// Financial statement conditionb report
export const FinancialStatementConditionReportSchema = z
    .object({
        month: MonthSchema,
        year: YearSchema,

        report_type: z
            .enum([
                'standard',
                'comparative_monthly',
                'comparative_yearly',
                'budget_forecasted',
            ])
            .default('standard'),

        as_of_previous_year: z.boolean().optional().default(false),

        par_calculation_method: z
            .enum([
                'by_amortization_loan_balance',
                'by_amortization_arrears',
                'by_amortization_arrears_distributed',
                'by_maturity',
            ])
            .default('by_amortization_loan_balance'),

        fall_to_current_if_1_30_days: z.boolean().optional().default(false),
    })
    .and(WithGeneratedReportSchema)
    .superRefine((data, ctx) => {
        if (
            data.report_type !== 'comparative_yearly' &&
            data.as_of_previous_year
        ) {
            ctx.addIssue({
                code: 'custom',
                message:
                    'As of previous year is only applicable for Comparative Yearly report',
                path: ['as_of_previous_year'],
            })
        }
    })

export type TFinancialStatementConditionReportSchema = z.infer<
    typeof FinancialStatementConditionReportSchema
>

// FOR Statement of operation report

export const StatementOfOperationsReportSchema = z
    .object({
        month: MonthSchema,
        year: YearSchema,

        report_type: z
            .enum([
                'standard',
                'comparative_monthly',
                'comparative_yearly',
                'budget_forecasted',
            ])
            .default('standard'),

        as_of_previous_year: z.boolean().optional().default(false),
    })
    .and(WithGeneratedReportSchema)
    .superRefine((data, ctx) => {
        if (
            data.report_type !== 'comparative_yearly' &&
            data.as_of_previous_year
        ) {
            ctx.addIssue({
                code: 'custom',
                message:
                    'As of previous year is only applicable for Comparative Yearly report',
                path: ['as_of_previous_year'],
            })
        }
    })

export type TStatementOfOperationsReportSchema = z.infer<
    typeof StatementOfOperationsReportSchema
>

// FOR REPORT CASH FLOW
export const CashFlowReportSchema = z
    .object({
        month: MonthSchema,
        year: YearSchema,

        comparative_type: z.enum(['yearly', 'monthly']).default('yearly'),
    })
    .and(WithGeneratedReportSchema)

export type TCashFlowReportSchema = z.infer<typeof CashFlowReportSchema>

// SL-GL Report schema

export const SLGLComparisonReportSchema = z
    .object({
        as_of_date: stringDateWithTransformSchema,
        exclude_write_off: z.boolean().optional().default(false),
    })
    .and(z.object({ report_config: z.any() }))

export type TSLGLComparisonReportSchema = z.infer<
    typeof SLGLComparisonReportSchema
>

// SL-TRX_GL
export const SLTRXGLComparisonReportSchema = z
    .object({
        as_of_date: z.string(),
    })
    .and(z.object({ report_config: z.any() }))

export type TSLTRXGLComparisonReportSchema = z.infer<
    typeof SLTRXGLComparisonReportSchema
>
