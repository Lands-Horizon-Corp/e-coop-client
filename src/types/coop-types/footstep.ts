import { IUserBase } from '../auth'
import { IAuditable, ITimeStamps, TEntityId, TUserType } from '../common'
import { IOrganization } from '../lands-types'
import { IBranch } from './branch'
import { IPaginatedResult } from './paginated-result'

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
