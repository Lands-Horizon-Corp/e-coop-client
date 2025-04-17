import { IUserBase } from './common'
import { IRolesResource } from './role'
import { IFootstepResource } from './footstep'

export interface IAdminResource extends IUserBase {
    accountType: 'Admin'
    description?: string
    role?: IRolesResource
    footsteps?: IFootstepResource[]
}
