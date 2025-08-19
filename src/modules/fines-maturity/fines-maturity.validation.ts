import z from 'zod'

import { entityIdSchema } from '@/validation'

export const finesMaturityISchema = z.object({
    account_id: entityIdSchema.optional().nullable(),
    from: z.number(),
    to: z.number(),
    rate: z.number(),
})
export type TFinesMaturityFormValues = z.infer<typeof finesMaturityISchema>
