import { z } from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
    organizationBranchIdsSchema,
} from '../common'

export const collateralSchema = z
    .object({
        id: entityIdSchema.optional(),
        name: z.string().min(1, 'Name is required'),
        description: descriptionSchema.transform(
            descriptionTransformerSanitizer
        ),
        icon: z.string().min(1, 'Icon is required'),
    })
    .merge(organizationBranchIdsSchema)
