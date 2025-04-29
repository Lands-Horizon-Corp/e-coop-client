import { IPaginatedResult } from '../coop-types'
import { ITimeStamps, TEntityId } from '../common' // Assuming these are still relevant

export interface ICoopUsageTrackingDaily extends ITimeStamps {
    id: TEntityId
    coop_id: TEntityId
    employees: number
    members: number
    branches: number
    online_transaction: number
}

export interface ICoopUsageTrackingDailyPaginated
    extends IPaginatedResult<ICoopUsageTrackingDaily> {}
