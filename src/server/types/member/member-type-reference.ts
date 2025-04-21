import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../paginated-result'

// TODO: Add IModifiedBy once user is updated
export interface IMemberTypeReferenceResource extends ITimeStamps, IAuditable {
    id: TEntityId
    accountId?: TEntityId
    memberTypeId?: TEntityId
    maintainingBalance?: number
    description?: string
    interestRate?: number
    minimumBalance?: number
    charges?: number
    activeMemberMinimumBalance?: number
    activeMemberRatio?: number
    otherInterestOnSavingComputationMinimumBalance?: number
    otherInterestOnSavingComputationInterestRate?: number
}

export interface IMemberTypeReferencePaginatedResource
    extends IPaginatedResult<IMemberTypeReferenceResource> {}
