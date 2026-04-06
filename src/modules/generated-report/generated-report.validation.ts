import z from 'zod'

import {
    MonthSchema,
    YearSchema,
    stringDateWithTransformSchema,
} from '@/validation'

import { GENERATE_REPORT_TYPE } from './generated-report.types'
import {
    ACCOUNT_MODEL_NAMES,
    PAPER_SIZE_UNIT,
} from './generated-reports.constants'

const SIZE_REGEX = new RegExp(`^\\d+(\\.\\d+)?(${PAPER_SIZE_UNIT.join('|')})$`)

export const SizeWithUnitSchema = z
    .string()
    .regex(SIZE_REGEX, 'Invalid size format (e.g. 8.5in, 210mm)')
    .refine((val) => parseFloat(val) > 0, {
        message: 'Size must be greater than 0',
    })

// FOR PRINT CONFIG SECTION ON PRINTABLE FORMS
export const GeneratedReportSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(1, 'Password is required').optional(),

    module: z.enum(ACCOUNT_MODEL_NAMES),

    template: z.string().min(1, 'Template path is required'),
    width: SizeWithUnitSchema.default('0in'),
    height: SizeWithUnitSchema.default('0in'),

    filters: z.any().optional().default({}),

    orientation: z.enum(['portrait', 'landscape']).default('portrait'),
    unit: z.enum(PAPER_SIZE_UNIT).optional(),

    generated_report_type: z.enum(GENERATE_REPORT_TYPE).default('pdf'),
})

//GENERATED REPORT SCHEMA
export type TGeneratedReportSchema = z.infer<typeof GeneratedReportSchema>

export const WithGeneratedReportSchema = z.object({
    report_config: GeneratedReportSchema,
})

export type TWithReportConfigSchema = z.infer<typeof WithGeneratedReportSchema>

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
