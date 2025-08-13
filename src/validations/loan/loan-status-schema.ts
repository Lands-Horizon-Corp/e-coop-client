import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'

export const loanStatusSchema = z.object({
    id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),

    name: z.string().min(1, 'Loan status name is required'),
    icon: z.string(),
    color: z.string(),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
