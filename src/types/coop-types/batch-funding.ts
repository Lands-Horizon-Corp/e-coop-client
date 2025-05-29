import { IMedia } from './media'
import { IBranch } from './branch'
import { IUserBase } from '../auth'
import { IOrganization } from '../lands-types'
import { ITransactionBatch } from './transaction-batch'
import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from './paginated-result'

export interface IBatchFundingRequest {
    id?: TEntityId

    organization_id?: TEntityId
    branch_id?: TEntityId

    transaction_batch_id?: TEntityId
    provided_by_user_id: TEntityId
    signature_media_id?: TEntityId

    name: string
    amount: number
    description?: string
}

export interface IBatchFunding extends ITimeStamps, IAuditable {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    branch_id: TEntityId
    branch: IBranch

    transaction_batch_id: TEntityId
    transaction_batch?: ITransactionBatch

    provided_by_user_id: TEntityId
    provided_by_user: IUserBase

    signature_media_id?: TEntityId
    signature_media?: IMedia

    name: string
    amount: number
    description?: string
}

export interface IBatchFundingPaginated
    extends IPaginatedResult<IBatchFunding> {}
