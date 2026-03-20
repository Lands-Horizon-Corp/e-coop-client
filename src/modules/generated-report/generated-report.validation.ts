import z from 'zod'

import { descriptionTransformerSanitizer } from '@/validation'

import { GENERATE_REPORT_TYPE } from './generated-report.types'
import {
    ACCOUNT_MODEL_NAMES,
    PAPER_SIZE_UNIT,
} from './generated-reports.constants'

export const GeneratedReportSchema = z.object({
    name: z.string().optional(),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    filter_search: z.string().optional(),
    url: z.string().optional(),
    model: z.enum(ACCOUNT_MODEL_NAMES),
    generated_report_type: z.enum(GENERATE_REPORT_TYPE),

    // Optional print settings
    paper_size: z.string().optional(),
    template: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    unit: z.enum(PAPER_SIZE_UNIT).optional(),
    landscape: z.boolean().optional(),
    template_config: z
        .object({
            value: z.string().optional(),
            label: z.string().optional(),
            defaultSize: z.string(),
            description: z.string().optional(),
        })
        .optional(),
})
export type TGeneratedReportFormValues = z.infer<typeof GeneratedReportSchema>

const SIZE_REGEX = new RegExp(`^\\d+(\\.\\d+)?(${PAPER_SIZE_UNIT.join('|')})$`)

export const SizeWithUnitSchema = z
    .string()
    .regex(SIZE_REGEX, 'Invalid size format (e.g. 8.5in, 210mm)')
    .refine((val) => parseFloat(val) > 0, {
        message: 'Size must be greater than 0',
    })

// FOR PRINT CONFIG SECTION ON PRINTABLE FORMS
export const ReportConfigSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(1, 'Password is required').optional(),

    module: z.enum(ACCOUNT_MODEL_NAMES),

    template: z.string().min(1, 'Template path is required'),
    width: SizeWithUnitSchema.default('0in'),
    height: SizeWithUnitSchema.default('0in'),

    filters: z.any().optional().default({}),

    landscape: z.boolean().optional(),
    unit: z.enum(PAPER_SIZE_UNIT).optional(),
})
export type TReportConfigSchema = z.infer<typeof ReportConfigSchema>

export const WithReportConfigSchema = z.object({
    report_config: ReportConfigSchema,
})

export type TWithReportConfigSchema = z.infer<typeof WithReportConfigSchema>
