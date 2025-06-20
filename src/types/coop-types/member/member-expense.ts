import { IAuditable, ITimeStamps, TEntityId } from '../../common'
import { IBranch } from '../branch'
import { IMemberProfile } from './member-profile'

// LATEST FROM ERD
export interface IMemberExpenseRequest {
    id?: TEntityId
    name: string
    amount: number
    description: string
}

// LATEST FROM ERD
export interface IMemberExpense extends ITimeStamps, IAuditable {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    branch_id: TEntityId
    branch: IBranch

    name: string
    amount: number
    description: string
}
