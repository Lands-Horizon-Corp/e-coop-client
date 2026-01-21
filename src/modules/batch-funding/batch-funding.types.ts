import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

import { IBranch } from '../branch/branch.types'
import { ICurrency } from '../currency'
import { IMedia } from '../media/media.types'
import { IOrganization } from '../organization/organization.types'
import { ITransactionBatch } from '../transaction-batch'
import { IUserBase } from '../user'
import { BatchFundingSchema } from './batch-funding.validation'

export interface IBatchFunding extends IBaseEntityMeta {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    currency_id: TEntityId
    currency: ICurrency

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

export type IBatchFundingRequest = z.infer<typeof BatchFundingSchema>

export interface IBatchFundingPaginated
    extends IPaginatedResult<IBatchFunding> {}
