import { z } from 'zod'

import { entityIdSchema, organizationBranchIdsSchema } from '../common'

export const collateralSchema = z
    .object({
        id: entityIdSchema.optional(),
        name: z.string().min(1, 'Name is required'),
        description: z.string(),
        icon: z.string().min(1, 'Icon is required'),
    })
    .merge(organizationBranchIdsSchema)
