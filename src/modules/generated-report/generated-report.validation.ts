import z from 'zod'

import { descriptionTransformerSanitizer } from '@/validation'

import {
    ACCOUNT_MODEL_NAMES,
    GENERATE_REPORT_TYPE,
} from './generated-report.types'
import { PAPER_SIZE_UNIT } from './generated-reports.constants'

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
