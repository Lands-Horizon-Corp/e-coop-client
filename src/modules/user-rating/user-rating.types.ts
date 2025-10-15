import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IUser } from '../user/user.types'

export interface IUserRatingRequest {
    id?: TEntityId
    ratee_user_id: TEntityId
    rater_user_id: TEntityId
    rate: number
    remark?: string
}

export interface IUserRating extends IBaseEntityMeta {
    id: TEntityId
    ratee_user_id: TEntityId
    ratee_user?: IUser
    rater_user_id: TEntityId
    rater_user?: IUser
    rate: number
    remark: string
}
