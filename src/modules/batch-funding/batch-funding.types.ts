import z from 'zod'

import { IBranch } from '../branch/branch.types'
import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'
import { IMedia } from '../media/media.types'
import { IOrganization } from '../organization/organization.types'

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
    // transaction_batch?: ITransactionBatch

    provided_by_user_id: TEntityId
    // provided_by_user: IUserBase

    signature_media_id?: TEntityId
    signature_media?: IMedia

    name: string
    amount: number
    description?: string
}

export interface IBatchFundingPaginated
    extends IPaginatedResult<IBatchFunding> {}

export const batchFundingSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    amount: z.coerce.number().min(0, 'Amount is required'),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
    organization_id: z.string().optional(),
    branch_id: z.string().optional(),
    transaction_batch_id: entityIdSchema.min(1, 'Batch is required'),
    provided_by_user_id: entityIdSchema.min(1, 'Provider is required'),
    provided_by_user: z.any(),
    signature_media_id: z.string().optional(),
    signature_media: z.any(),
})

export type TBatchFundingFormValues = z.infer<typeof batchFundingSchema>
