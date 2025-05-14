import { IBranch } from '../coop-types'
import { IUserBase } from '../auth/user'
import { IOrganization } from './organization'
import { TEntityId, IBaseEntityMeta, TUserType } from '../common'

export interface IUserOrganization extends IBaseEntityMeta {
    id: TEntityId

    organization_id: TEntityId
    organization?: IOrganization

    branchId: string
    branch?: IBranch

    description?: string

    user_id: TEntityId
    user: IUserBase

    user_type: TUserType

    applicationDescription?: string
    applicationStatus: 'pending' | 'reported' | 'accepted' | 'ban'
}
