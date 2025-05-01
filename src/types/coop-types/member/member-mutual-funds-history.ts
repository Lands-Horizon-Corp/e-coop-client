import { IBranch } from '../branch'
import { IMemberProfile } from './member-profile'
import { IPaginatedResult } from '../paginated-result'
import { IAuditable, ITimeStamps, TEntityId } from '../../common'

// LATEST FROM ERD
export interface IMemberMutualFundsHistory extends ITimeStamps, IAuditable {
    id: TEntityId

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    branch_id: TEntityId
    branch: IBranch

    title: string
    amount: number
    description: string
}

export interface IMemberMutualFundsHistoryPaginated
    extends IPaginatedResult<IMemberMutualFundsHistory> {}
