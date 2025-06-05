import { IUserBase } from '../auth'
import { IPaginatedResult } from './paginated-result'
import { ITimeStamps, TEntityId, IAuditable, TUserType } from '../common'

export interface IFootstep extends ITimeStamps, IAuditable {
    id: TEntityId
    branch_id: TEntityId | null

    user_type: TUserType
    user_id: TEntityId
    user: IUserBase

    module: string
    description: string | null
    activity: string

    latitude: number | null
    longitude: number | null
    ip_address: string | null
    user_agent: string | null
    referer: string | null
    location: string | null
    accept_language: string | null
}

export interface IFootstepPaginated extends IPaginatedResult<IFootstep> {}
