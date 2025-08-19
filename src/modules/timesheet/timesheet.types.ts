import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IMedia } from '../media/media.types'
import { IUser } from '../user/user.types'

export interface ITimesheetRequest {
    media_id?: TEntityId
}

export interface ITimesheet
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    user_id: TEntityId
    user?: IUser
    media_in_id?: TEntityId
    media_in?: IMedia
    media_out_id?: TEntityId
    media_out?: IMedia
    time_in: string
    time_out?: string
}
