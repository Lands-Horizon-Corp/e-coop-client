import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

export const includeNegativeAccountSchema = z.object({
    id: entityIdSchema.optional(),

    computation_sheet_id: entityIdSchema,
    account_id: entityIdSchema,
    account: z.any(),

    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TIncludeNegativeAccountFormValues = z.infer<
    typeof includeNegativeAccountSchema
>
