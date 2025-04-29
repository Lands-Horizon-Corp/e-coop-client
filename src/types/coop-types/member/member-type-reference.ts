import { IMemberType } from './member-type'
import { IPaginatedResult } from '../paginated-result'
import { IAccountsResource } from '../accounts/accounts'
import { IAuditable, ITimeStamps, TEntityId } from '../../common'

export interface IMemberTypeReferenceRequest {
    id?: TEntityId
    accountId: TEntityId
    memberTypeId: TEntityId
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

// TODO: Add IModifiedBy once user is updated
export interface IMemberTypeReference extends ITimeStamps, IAuditable {
    id: TEntityId
    accountId?: TEntityId
    account?: IAccountsResource
    memberTypeId?: TEntityId
    memberType?: IMemberType
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
    extends IPaginatedResult<IMemberTypeReference> {}
