import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IMedia } from '../media'
import { IUser } from '../user'
import { FeedCommentSchema } from './feed-comment.validation'

export interface IFeedComment extends IBaseEntityMeta {
    feed_id: TEntityId
    user_id: TEntityId
    user: IUser
    comment: string
    media_id?: TEntityId
    media?: IMedia
}

export type IFeedCommentRequest = z.infer<typeof FeedCommentSchema>

export interface IFeedCommentPaginated extends IPaginatedResult<IFeedComment> {}
