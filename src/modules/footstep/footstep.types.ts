import { IUserBase, TUserType } from '@/modules/user'
import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IBranch } from '../branch'
import { IOrganization } from '../organization'

export type TFootstepLevel = 'info' | 'warning' | 'error' | 'debug'
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

export interface IFootstepRequest {
    level: TFootstepLevel
    description: string
    activity: string
    module: string
}

export interface IFootstepPaginated extends IPaginatedResult<IFootstep> {}
