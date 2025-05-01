import { IUserBase } from '../auth/user'
import { IOrganization } from './organization'
import { IBranch, IPaginatedResult } from '../coop-types'
import { IAuditable, ITimeStamps, TEntityId } from '../common'

export type TGenerateReportType = 'pending' | 'canceled' | 'error' | 'completed'

export interface IGeneratedReport extends ITimeStamps, IAuditable {
    id: TEntityId

    user_id: TEntityId
    user: IUserBase

    organization_id: TEntityId
    organization: IOrganization

    branch_id: TEntityId
    branch: IBranch

    status: TGenerateReportType
    progress: number
}

export interface IGeneratedReportPaginated
    extends IPaginatedResult<IGeneratedReport> {}
