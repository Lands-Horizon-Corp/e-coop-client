import z from 'zod'

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
