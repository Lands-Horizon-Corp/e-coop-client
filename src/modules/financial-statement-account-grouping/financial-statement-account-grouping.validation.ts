import { z } from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '@/validation'

export const financialStatementGroupingSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
    debit: z.enum(['positive', 'negative'], {
        error: 'Debit is required',
    }),
    credit: z.enum(['positive', 'negative'], {
        error: 'Credit is required',
    }),
    from_code: z.coerce.number().optional(),
    to_code: z.coerce.number().optional(),
})

export type TFinancialStatementGroupingFormValues = z.infer<
    typeof financialStatementGroupingSchema
>
