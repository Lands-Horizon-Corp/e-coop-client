import { IUserBase } from '../common'
import { IRoles } from './role'
import { IBranch } from './branch'
import { IFootstep } from './footstep'
import { ITimesheet } from './timesheet'

// TODO
export interface IEmployeeResource extends IUserBase {
    accountType: 'Employee'
    branch?: IBranch
    longitude?: number
    latitude?: number
    timesheets?: ITimesheet[]
    role?: IRoles
    footsteps?: IFootstep[]
}
