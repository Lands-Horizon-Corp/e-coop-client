import { IMedia } from './media'
import { IPaginatedResult } from './paginated-result'
import { IAuditable, ITimeStamps, TEntityId } from '../common'

export interface IBranchRequest {
    id?: TEntityId

    media_id: string | null

    type: 'cooperative branch' | string
    name: string
    email: string

    description: string
    country_code: string
    contact_number: string

    address: string
    province: string
    city: string
    region: string
    barangay: string
    postal_code: string

    latitude?: number
    longitude?: number

    is_main_branch: boolean
    is_admin_verified?: boolean
}

// Resource
export interface IBranch extends ITimeStamps, IAuditable {
    id: TEntityId

    media_id: string | null
    media: IMedia

    type: 'cooperative branch' | string
    name: string
    email: string

    description: string | null
    country_code: string
    contact_number: string | null

    address: string
    province: string
    city: string
    region: string
    barangay: string
    postal_code: string

    latitude: number | null
    longitude: number | null

    is_main_branch: boolean
    is_admin_verified: boolean | null
}

export interface IBranchPaginated extends IPaginatedResult<IBranch> {}
