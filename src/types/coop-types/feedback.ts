import { TEntityId } from '../common'
import { IPaginatedResult } from './paginated-result'

export interface IFeedbackRequest {
    email: string
    description: string
    feedbackType: string
}

// TODO: this noted to be part of coop lands
export interface IFeedback {
    id: TEntityId
    email: string
    description: string
    feedbackType: string
    createdAt: string
    updatedAt: string
}

export interface IFeedbackPaginatedResource
    extends IPaginatedResult<IFeedback> {}
