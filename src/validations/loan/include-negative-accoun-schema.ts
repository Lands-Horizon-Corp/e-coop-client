import { z } from 'zod'

import { entityIdSchema, organizationBranchIdsSchema } from '../common'

export const includeNegativeAccountSchema = z
    .object({
        id: entityIdSchema.optional(),

        computation_sheet_id: entityIdSchema,
        account_id: entityIdSchema,

        description: z.string().optional(),
    })
    .merge(organizationBranchIdsSchema)
