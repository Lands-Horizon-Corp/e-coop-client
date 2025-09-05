import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IBranch } from '../branch/branch.types'
import { IMedia } from '../media/media.types'
import { IOrganization } from '../organization'
import { IUserBase } from '../user/user.types'

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
