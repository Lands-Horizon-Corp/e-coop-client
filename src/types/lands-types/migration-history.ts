import { IPaginatedResult } from '../coop-types'
import { IAuditable, ITimeStamps, TEntityId } from '../common'

export interface IMigrationHistory extends ITimeStamps, IAuditable {
    id: TEntityId
    coop_db_id: TEntityId
    status: string
}

export interface IMigrationHistoryPaginated
    extends IPaginatedResult<IMigrationHistory> {}
