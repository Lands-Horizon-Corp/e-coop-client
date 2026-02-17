import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IMedia } from '../media'
import { FeedMediaSchema } from './feed-media.validation'

export interface IFeedMedia extends IBaseEntityMeta {
    feed_id: TEntityId
    media_id: TEntityId
    media?: IMedia
}

export type IFeedMediaRequest = z.infer<typeof FeedMediaSchema>

export interface IFeedMediaPaginated extends IPaginatedResult<IFeedMedia> {}
