import { ITimeStamps, TEntityId } from '../common'
import { IMedia } from './media'
import { IMember } from './member/member'
import { ICompanyResource } from './company'
import { IEmployeeResource } from './employee'
import { IPaginatedResult } from './paginated-result'

export interface IBranchRequest {
    name: string
    address?: string
    description?: string
    longitude?: number
    latitude?: number
    email: string
    contactNumber: string
    isAdminVerified: boolean
    mediaId?: TEntityId
    companyId?: TEntityId
}

export interface IBranch extends ITimeStamps {
    id: TEntityId
    name: string
    address?: string
    description?: string
    longitude?: number
    latitude?: number
    email: string
    companyId?: TEntityId
    contactNumber: string
    isAdminVerified: boolean
    media?: IMedia
    company?: ICompanyResource
    employees?: IEmployeeResource[]
    members?: IMember[]
}

export interface IBranchPaginated extends IPaginatedResult<IBranch> {}
