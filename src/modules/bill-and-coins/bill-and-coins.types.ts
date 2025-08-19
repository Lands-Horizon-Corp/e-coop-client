import { IPaginatedResult, ITimeStamps, TEntityId } from '@/types/common'

import { IBranch } from '../branch/branch.types'
import { IMedia } from '../media/media.types'
import { IOrganization } from '../organization/organization.types'

export interface IBillsAndCoinRequest {
    id?: TEntityId

    organization_id?: TEntityId
    branch_id?: TEntityId

    media_id?: TEntityId

    name: string
    value: number
    country_code: string
}

export interface IBillsAndCoin extends ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    branch_id: TEntityId
    branch: IBranch

    created_by_id?: TEntityId
    updated_by_id?: TEntityId
    deleted_by_id?: TEntityId

    media_id?: TEntityId
    media?: IMedia

    name: string
    value: number
    country_code: string
}

export interface IBillsAndCoinPaginated
    extends IPaginatedResult<IBillsAndCoin> {}
