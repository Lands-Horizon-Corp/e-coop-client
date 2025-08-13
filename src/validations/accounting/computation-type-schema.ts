import { z } from 'zod'

import { descriptionSchema, descriptionTransformerSanitizer } from '../common'

export const AccountsComputationTypeRequestSchema = z.object({
    id: z.string(),
    companyId: z.string(),
    name: z.string().min(1, 'Name is required'),
    description: descriptionSchema
        .min(1, 'Description is required')
        .transform(descriptionTransformerSanitizer),
})
