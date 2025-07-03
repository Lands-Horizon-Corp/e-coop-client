import z from 'zod'

import { entityIdSchema } from '@/validations/common'

export const memberAssetsSchema = z.object({
    id: entityIdSchema.optional(),
    entryDate: z.string().min(1, 'Entry Date is required'),
    description: z.string().min(1, 'Description is required'),
    name: z.string().min(1, 'Name is required'),
})
