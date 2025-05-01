import { IBranch } from '../branch'
import { IMemberType } from './member-type'
import { IPaginatedResult } from '../paginated-result'
import { IAccountResource } from '../accounts/accounts'
import { IAuditable, ITimeStamps, TEntityId } from '../../common'

// LATEST FROM ERD
export interface IMemberTypeReferenceRequest {
    id?: TEntityId

    branch_id: TEntityId
    account_id: TEntityId
    member_type_id: TEntityId

    charges: number
    description: string
    interest_rate: number
    minimum_balance: number
    maintaining_balance: number
    active_member_ratio: number
    active_member_minimum_balance: number

    other_interest_on_saving_computation_minimum_balance: number
    other_interest_on_saving_computation_interest_rate: number
}

// LATEST FROM ERD
export interface IMemberTypeReference extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    account_id: TEntityId
    account: IAccountResource

    member_type_id: TEntityId
    member_type: IMemberType

    maintaining_balance: number
    description: string
    interest_rate: number
    minimum_balance: number
    charges: number
    active_member_minimum_balance: number
    active_member_ratio: number

    other_interest_on_saving_computation_minimum_balance: number
    other_interest_on_saving_computation_interest_rate: number
}

export interface IMemberTypeReferencePaginatedResource
    extends IPaginatedResult<IMemberTypeReference> {}
