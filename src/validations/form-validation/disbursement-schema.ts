import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'

export const disbursementSchema = z.object({
    id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),

    name: z.coerce.string().min(1, 'Name is required'),
    icon: z.coerce.string().optional(),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
