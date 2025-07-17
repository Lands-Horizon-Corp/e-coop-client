import { ITimeStamps, TEntityId } from '../common'
import { IOrganization } from '../lands-types'
import { IBranch } from './branch'
import { IMedia } from './media'
import { IPaginatedResult } from './paginated-result'

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
