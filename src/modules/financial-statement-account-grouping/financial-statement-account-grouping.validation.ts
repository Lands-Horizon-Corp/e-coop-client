import { z } from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '@/validation'

export const financialStatementGroupingSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: descriptionSchema
        .transform(descriptionTransformerSanitizer)
        .optional(),
    debit: z.coerce
        .number<number>({ error: 'Debit must be a number' })
        .optional(),
    credit: z.coerce
        .number<number>({ error: 'Credit must be a number' })
        .optional(),
    from_code: z.coerce
        .number<number>({ error: 'From Code must be a number' })
        .optional(),
    to_code: z.coerce
        .number<number>({ error: 'To Code must be a number' })
        .optional(),
})

export type TFinancialStatementGroupingFormValues = z.infer<
    typeof financialStatementGroupingSchema
>
