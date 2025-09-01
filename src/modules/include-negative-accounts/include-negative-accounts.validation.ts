import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const IncludeNegativeAccountsSchema = z.object({
    id: entityIdSchema.optional(),

    computation_sheet_id: entityIdSchema,
    account_id: entityIdSchema,
    account: z.any(),

    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TIncludeNegativeAccountsSchema = z.infer<
    typeof IncludeNegativeAccountsSchema
>
