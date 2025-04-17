import { IOwnerResource } from './owner'
import { IAdminResource } from './admin'
import { IMemberResource } from './member/member'
import { IEmployeeResource } from './employee'
import { TAccountType, TEntityId } from './common'
import { IPaginatedResult } from './paginated-result'

export interface IFootstepResource {
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
    admin?: IAdminResource
    employeeId?: TEntityId
    employee?: IEmployeeResource
    ownerId?: TEntityId
    owner?: IOwnerResource
    memberId?: TEntityId
    member?: IMemberResource
}

export interface IFootstepPaginatedResource
    extends IPaginatedResult<IFootstepResource> {}
