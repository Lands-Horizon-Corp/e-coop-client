import { z } from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
    organizationBranchIdsSchema,
} from '../common'

export const includeNegativeAccountSchema = z
    .object({
        id: entityIdSchema.optional(),

        computation_sheet_id: entityIdSchema,
        account_id: entityIdSchema,

        description: descriptionSchema
            .optional()
            .transform(descriptionTransformerSanitizer),
    })
    .merge(organizationBranchIdsSchema)
