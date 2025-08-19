import { ITimeStamps, TEntityId } from '@/types/common'

import { IMedia } from '../media/media.types'

export interface IFeedbackRequest {
    id?: TEntityId | null
    email: string
    description: string
    feedback_type: 'general' | 'bug' | 'feature'
    media_id?: TEntityId | null
}

export interface IFeedback extends ITimeStamps {
    id: TEntityId
    email: string
    description: string
    feedback_type: 'general' | 'bug' | 'feature'
    media_id?: TEntityId
    media?: IMedia
}
