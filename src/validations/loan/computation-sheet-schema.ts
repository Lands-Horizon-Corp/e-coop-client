import { z } from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'

export const computationSheetSchema = z.object({
    id: entityIdSchema.optional(),

    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),

    name: z.string().min(1, { message: 'Name is required' }),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),

    deliquent_account: z.boolean(),
    fines_account: z.boolean(),
    interest_account: z.boolean(),
    comaker_account: z.coerce.number().default(-1),
    exist_account: z.boolean(),
})
