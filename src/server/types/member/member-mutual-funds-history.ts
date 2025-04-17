import { ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberProfileResource } from './member-profile'

export interface IMemberMutualFundsHistoryResource extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    description: string
    amount: number
    membersProfile?: IMemberProfileResource
}

export interface IMemberMutualFundsHistoryPaginatedResource
    extends IPaginatedResult<IMemberMutualFundsHistoryResource> {}
