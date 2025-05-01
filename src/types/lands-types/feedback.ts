import { FEEDBACK_TYPE } from '@/constants/commons'

import { ITimeStamps, TEntityId } from '../common'
import { IMedia, IPaginatedResult } from '../coop-types'

export type TFeedbackType = (typeof FEEDBACK_TYPE)[number]

export interface IFeedback extends ITimeStamps {
    id: TEntityId

    email: string
    name: string
    feedback_type: TFeedbackType

    description: string

    media_id: TEntityId
    media: IMedia
}

export interface IFeedbackPaginated extends IPaginatedResult<IFeedback> {}
