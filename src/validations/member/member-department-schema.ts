import { z } from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'

export const TMemberDepartmentSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Department name is required'),
    description: descriptionSchema
        .min(15, 'Department Description is required')
        .optional()
        .transform(descriptionTransformerSanitizer),
    icon: z.string().optional(),
})
