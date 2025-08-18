import z from 'zod'

import { ITimeStamps, TEntityId, entityIdSchema } from '../common'
import { IMedia } from '../media/media.types'

export interface IFeedbackRequest {
    id?: TEntityId
    email: string
    description: string
    feedback_type: 'general' | 'bug' | 'feature'
    media_id?: TEntityId
}

export interface IFeedbackResponse extends ITimeStamps {
    id: TEntityId
    email: string
    description: string
    feedback_type: 'general' | 'bug' | 'feature'
    media_id?: TEntityId
    media?: IMedia
}

export const feedbackRequestSchema = z.object({
    id: entityIdSchema.optional().nullable(),
    email: z.string().email().max(255),
    description: z.string().min(5).max(2000),
    feedback_type: z.enum(['general', 'bug', 'feature']),
    media_id: entityIdSchema.optional().nullable(),
})
