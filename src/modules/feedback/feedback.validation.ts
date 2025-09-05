import z from 'zod'

import { entityIdSchema } from '@/validation'

export const feedbackSchema = z.object({
    id: entityIdSchema.optional().nullable(),
    email: z.email().max(255),
    description: z.string().min(5).max(2000),
    feedback_type: z.enum(['general', 'bug', 'feature']),
    media_id: entityIdSchema.optional().nullable(),
})
