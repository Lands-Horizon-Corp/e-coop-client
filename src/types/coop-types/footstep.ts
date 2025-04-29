import { IOwner } from './owner'
import { IAdmin } from './admin'
import { IMember } from './member/member'
import { IEmployeeResource } from './employee'
import { TAccountType, TEntityId } from '../common'
import { IPaginatedResult } from './paginated-result'

export interface IFootstep {
    id: TEntityId
    createdAt: string
    updatedAt: string
    deletedAt: string

    accountType: TAccountType
    module: string
    description: string
    activity: string
    latitude?: number
    longitude?: number
    timestamp: string
    isDeleted: boolean

    adminId?: TEntityId
    admin?: IAdmin
    employeeId?: TEntityId
    employee?: IEmployeeResource
    ownerId?: TEntityId
    owner?: IOwner
    memberId?: TEntityId
    member?: IMember
}

export interface IFootstepPaginated extends IPaginatedResult<IFootstep> {}
