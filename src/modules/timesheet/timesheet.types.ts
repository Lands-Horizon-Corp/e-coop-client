import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '../common'
import { IMedia } from '../media/media.types'
import { IUser } from '../user/user.types'

export interface ITimesheetRequest {
    media_id?: TEntityId
}

export interface ITimesheetResponse
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

export const timesheetRequestSchema = z.object({
    media_id: entityIdSchema.optional(),
})
