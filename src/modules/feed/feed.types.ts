import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { IFeedComment } from '../feed-comment'
import { IFeedMedia } from '../feed-media'
import { IUser } from '../user'
import { FeedSchema } from './feed.validation'

export interface IFeed extends IBaseEntityMeta {
    description: string
    feed_medias?: IFeedMedia[]
    feed_comments?: IFeedComment[]
    user_likes?: IUser[]
    is_liked: boolean
}

export type IFeedRequest = z.infer<typeof FeedSchema>

export interface IFeedPaginated extends IPaginatedResult<IFeed> {}
