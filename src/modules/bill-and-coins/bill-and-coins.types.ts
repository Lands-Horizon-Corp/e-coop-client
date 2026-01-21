import { IPaginatedResult, ITimeStamps, TEntityId } from '@/types/common'

import { IBranch } from '../branch/branch.types'
import { ICurrency } from '../currency'
import { IMedia } from '../media/media.types'
import { IOrganization } from '../organization/organization.types'
import { TBillsAndCoinSchema } from './bill-and-coins.validation'

export type IBillsAndCoinRequest = TBillsAndCoinSchema

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

    currency_id: TEntityId
    currency: ICurrency
}

export interface IBillsAndCoinPaginated
    extends IPaginatedResult<IBillsAndCoin> {}
