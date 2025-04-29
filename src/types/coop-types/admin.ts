import { IUserBase } from '../common'
import { IRoles } from './role'
import { IFootstep } from './footstep'

export interface IAdmin extends IUserBase {
    accountType: 'Admin'
    description?: string
    role?: IRoles
    footsteps?: IFootstep[]
}
