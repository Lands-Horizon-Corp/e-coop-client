import z from 'zod'

import { entityIdSchema } from '@/validation'

export const interestMaturitySchema = z.object({
    account_id: entityIdSchema.nullable().optional(),
    from: z.number(),
    to: z.number(),
    rate: z.number(),
})
export type TInterestMaturityFormValues = z.infer<typeof interestMaturitySchema>
