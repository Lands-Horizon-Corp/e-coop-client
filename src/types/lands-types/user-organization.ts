import { IBranch } from '../coop-types'
import { IUserBase } from '../auth/user'
import { IOrganization } from './organization'
import { ITimeStamps, TEntityId, IAuditable } from '../common'

export interface IUserOrganization extends ITimeStamps, IAuditable {
    id: TEntityId

    organization_id: TEntityId
    organization?: IOrganization

    branchId: string
    branch?: IBranch

    description?: string

    user_id: TEntityId
    user: IUserBase

    applicationDescription?: string
    applicationStatus: 'pending' | 'reported' | 'accepted' | 'ban'
}
