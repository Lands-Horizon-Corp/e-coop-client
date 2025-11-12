import z from 'zod'

import { descriptionTransformerSanitizer } from '@/validation'

import { ACCOUNT_MODEL_NAMES } from './generated-report.types'

export const GeneratedReportSchema = z.object({
    name: z.string().min(1, 'GeneratedReport name is required'),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    url: z.string().min(1, 'url is required'),
    model: z.enum(ACCOUNT_MODEL_NAMES, { error: 'model is required' }),
    filter_search: z.string().optional().default(''),
    generated_report_type: z.enum(['pdf', 'excel']).default('excel'),
})

export type TGeneratedReportFormValues = z.infer<typeof GeneratedReportSchema>
