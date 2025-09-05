import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
    TUserType,
} from '@/types/common'

import { IBranch } from '../branch'
import { IOrganization } from '../organization'
import { IUserBase } from '../user/user.types'

export interface IFootstep extends ITimeStamps, IAuditable {
    id: TEntityId

    organization_id?: TEntityId
    organization?: IOrganization

    branch_id?: TEntityId
    branch?: IBranch

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
