import z from 'zod'

import { entityIdSchema } from '@/validation'

export const fundsSchema = z.object({
    account_id: entityIdSchema.nullable().optional(),
    type: z.string().min(1).max(255),
    description: z.string().optional(),
    icon: z.string().nullable().optional(),
    gl_books: z.string().optional(),
})
export type TFundsFormValues = z.infer<typeof fundsSchema>
