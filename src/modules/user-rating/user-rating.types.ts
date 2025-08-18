import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '../common'
import { IUser } from '../user/user.types'

export interface IUserRatingRequest {
    id?: TEntityId
    ratee_user_id: TEntityId
    rater_user_id: TEntityId
    rate: number
    remark?: string
}

export interface IUserRatingResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    ratee_user_id: TEntityId
    ratee_user?: IUser
    rater_user_id: TEntityId
    rater_user?: IUser
    rate: number
    remark: string
}

export const userRatingRequestSchema = z.object({
    id: entityIdSchema.optional(),
    ratee_user_id: entityIdSchema,
    rater_user_id: entityIdSchema,
    rate: z.number().min(1).max(5),
    remark: z.string().max(2000).optional(),
})
