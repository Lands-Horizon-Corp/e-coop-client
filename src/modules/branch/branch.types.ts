import { IAuditable, IPaginatedResult, ITimeStamps, TEntityId } from '@/types'

import { IBranchSettings } from '../branch-settings'
import { ICurrency } from '../currency'
import { IMedia } from '../media'
import { IOrganization } from '../organization'
import { TBranchSchema } from './branch.validation'

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
    currency_id: TEntityId
    currency: ICurrency
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

    // FOR TAX
    tax_identification_number?: string
}

export type IBranchRequest = TBranchSchema

export interface IBranchPaginated extends IPaginatedResult<IBranch> {}
