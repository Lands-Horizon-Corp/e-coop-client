import { z } from 'zod'

import { descriptionSchema, descriptionTransformerSanitizer } from '../common'

export const TransactionTypeRequestSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
    chequeId: z.string().min(1, 'Cheque ID is required'),
})
