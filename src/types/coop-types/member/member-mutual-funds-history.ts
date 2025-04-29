import { ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberProfile } from './member-profile'

export interface IMemberMutualFundsHistory extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    description: string
    amount: number
    membersProfile?: IMemberProfile
}

export interface IMemberMutualFundsHistoryPaginated
    extends IPaginatedResult<IMemberMutualFundsHistory> {}
