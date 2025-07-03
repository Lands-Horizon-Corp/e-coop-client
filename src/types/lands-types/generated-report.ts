import { IUserBase } from '../auth/user'
import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IBranch, IMedia, IPaginatedResult } from '../coop-types'
import { IOrganization } from './organization'

export type TGenerateReportType = 'pending' | 'canceled' | 'error' | 'completed'

export interface IGeneratedReport extends ITimeStamps, IAuditable {
    id: TEntityId

    user_id: TEntityId
    user: IUserBase

    organization_id: TEntityId
    organization: IOrganization

    branch_id: TEntityId
    branch: IBranch

    media_id: TEntityId
    media: IMedia

    status: TGenerateReportType
    progress: number
}

export interface IGeneratedReportPaginated
    extends IPaginatedResult<IGeneratedReport> {}
