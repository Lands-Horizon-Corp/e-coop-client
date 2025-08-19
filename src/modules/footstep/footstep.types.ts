import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IMedia } from '../media/media.types'
import { IUser } from '../user/user.types'

export interface IFootstep extends ITimeStamps, IAuditable, IOrgBranchIdentity {
    id: TEntityId
    user_id?: TEntityId
    user?: IUser
    media_id?: TEntityId
    media?: IMedia
    description: string
    activity: string
    account_type: string
    module: string
    latitude?: number
    longitude?: number
    timestamp: string
    is_deleted: boolean
    ip_address: string
    user_agent: string
    referer: string
    location: string
    accept_language: string
}

export interface IFootstepRequest {
    organization_id: TEntityId
    branch_id: TEntityId
    user_id?: TEntityId
    media_id?: TEntityId
    description: string
    activity: string
    account_type: string
    module: string
    latitude?: number
    longitude?: number
    ip_address: string
    user_agent: string
    referer: string
    location: string
    accept_language: string
}
