import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IOrganization } from '../lands-types'
import { IMedia } from './media'
import { IPaginatedResult } from './paginated-result'

export enum branchTypeEnum {
    CooperativeBranch = 'cooperative branch',
    BusinessBranch = 'business branch',
    BankingBranch = 'banking branch',
}

export interface IBranchRequest {
    id?: TEntityId

    media_id: string | null

    type: branchTypeEnum
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

    organization_id: TEntityId
    organization: IOrganization

    media_id: string | null
    media: IMedia

    type: branchTypeEnum
    name: string
    email: string

    description?: string
    country_code?: string
    contact_number?: string

    address: string
    province: string
    city: string
    region: string
    barangay: string
    postal_code: string

    latitude: number
    longitude: number

    is_main_branch: boolean
}

export interface IBranchPaginated extends IPaginatedResult<IBranch> {}
