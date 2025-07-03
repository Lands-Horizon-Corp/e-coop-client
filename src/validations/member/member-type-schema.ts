import z from 'zod'

import { entityIdSchema } from '../common'

export const createMemberTypeSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    prefix: z.string().min(1, 'Prefix is required').max(3, 'Max 3 characters'),
    description: z.string().min(1, 'Description is required'),
})
