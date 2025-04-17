import { TEntityId } from './common'
import { IPaginatedResult } from './paginated-result'

export interface IFeedbackRequest {
    email: string
    description: string
    feedbackType: string
}

export interface IFeedbackResource {
    id: TEntityId
    email: string
    description: string
    feedbackType: string
    createdAt: string
    updatedAt: string
}

export interface IFeedbackPaginatedResource
    extends IPaginatedResult<IFeedbackResource> {}
