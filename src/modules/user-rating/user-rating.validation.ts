import z from 'zod'

import { entityIdSchema } from '@/validation'

export const userRatingRequestSchema = z.object({
    id: entityIdSchema.optional(),
    ratee_user_id: entityIdSchema,
    rater_user_id: entityIdSchema,
    rate: z.number().min(1).max(5),
    remark: z.string().max(2000).optional(),
})

export type IUserRatingRequest = z.infer<typeof userRatingRequestSchema>
