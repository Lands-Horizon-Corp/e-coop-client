import { IAuditable, ITimeStamps, TEntityId } from '../common'
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

// Resource
export interface IBranch extends ITimeStamps, IAuditable {
    id: TEntityId

    created_by_id: string
    updated_by_id: string
    deleted_by_id: string | null
    media_id: string | null
    type: 'cooperative branch' | string
    country_code: string
    is_main_branch: boolean
    name: string
    description: string | null
    address: string
    province: string
    postal_code: string
    city: string
    email: string
    region: string
    barangay: string
    contact_number: string | null
    is_admin_verified: boolean | null
    latitude: number | null
    longitude: number | null
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface IBranchPaginated extends IPaginatedResult<IBranch> {}
