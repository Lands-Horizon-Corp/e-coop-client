import { IAuditable, IPaginatedResult, ITimeStamps, TEntityId } from '@/types'

import { IBranchSettings } from '../branch-settings'
import { IMedia } from '../media'
import { IOrganization } from '../organization'

export enum branchTypeEnum {
    CooperativeBranch = 'cooperative branch',
    BusinessBranch = 'business branch',
    BankingBranch = 'banking branch',
}

// Resource
export interface IBranch extends ITimeStamps, IAuditable {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    media_id?: string
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

    is_main_branch?: boolean

    branch_setting: IBranchSettings
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

export interface IBranchPaginated extends IPaginatedResult<IBranch> {}
