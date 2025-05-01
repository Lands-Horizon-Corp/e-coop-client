import { IPaginatedResult } from '../coop-types'
import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IOrganization, TOrganizationMigrationStatus } from './organization'

export interface IMigrationHistory extends ITimeStamps, IAuditable {
    id: TEntityId
    organization_id: TEntityId
    organization: IOrganization

    name: string
    description: string

    span: number
    status: TOrganizationMigrationStatus
}

export interface IMigrationHistoryPaginated
    extends IPaginatedResult<IMigrationHistory> {}
