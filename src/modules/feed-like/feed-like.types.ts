import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IUser } from '../user'
import { FeedLikeSchema } from './feed-like.validation'

export interface IFeedLike extends IBaseEntityMeta {
    feed_id: TEntityId
    user_id: TEntityId
    user?: IUser
}

export type IFeedLikeRequest = z.infer<typeof FeedLikeSchema>

export interface IFeedLikePaginated extends IPaginatedResult<IFeedLike> {}
