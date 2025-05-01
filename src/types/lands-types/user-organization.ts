import { IUserBase } from '../auth/user'
import { ITimeStamps, TEntityId, IAuditable } from '../common'
import { IOrganization } from './organization'

export interface IUserOrganization extends ITimeStamps, IAuditable {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    user_id: TEntityId
    user: IUserBase
}
