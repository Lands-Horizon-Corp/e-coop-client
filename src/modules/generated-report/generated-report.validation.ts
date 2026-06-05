import z from 'zod'

import { GENERATE_REPORT_TYPE } from './generated-report.types'
import {
    DISPLAY_DENSITY,
    PAPER_ORIENTATION,
    PAPER_SIZE_UNIT,
    REPORT_NAMES,
} from './generated-reports.constants'

const SIZE_REGEX = new RegExp(`^\\d+(\\.\\d+)?(${PAPER_SIZE_UNIT.join('|')})$`)

export const PaperOrientationSchema = z.enum(PAPER_ORIENTATION)

export type TPaperOrientationSchema = z.infer<typeof PaperOrientationSchema>

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

    report_name: z.enum(REPORT_NAMES), // old name -> module

    template: z.string().min(1, 'Template is required'),
    width: SizeWithUnitSchema.default('0in'),
    height: SizeWithUnitSchema.default('0in'),

    filters: z.any().optional().default({}),

    // mga config na galing sa template, usually fixed to hindi nababago para ma identify ng server mo
    // yung dapat ipopulate na data or ano dapat gawin something
    template_filter: z.any().optional().default({}),

    orientation: PaperOrientationSchema.default('portrait'),
    unit: z.enum(PAPER_SIZE_UNIT).optional(),

    display_density: z.enum(DISPLAY_DENSITY).default('normal'), // Newly added -> 'compact', 'normal', 'loose' -> pass mo lagi kasi sa css stying to

    generated_report_type: z.enum(GENERATE_REPORT_TYPE).default('pdf'),
})

//GENERATED REPORT SCHEMA
export type TGeneratedReportSchema = z.infer<typeof GeneratedReportSchema>

export const WithGeneratedReportSchema = z.object({
    report_config: GeneratedReportSchema,
})

export type TWithReportConfigSchema = z.infer<typeof WithGeneratedReportSchema>
