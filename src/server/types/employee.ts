import { IUserBase } from './common'
import { IRolesResource } from './role'
import { IBranchResource } from './branch'
import { IFootstepResource } from './footstep'
import { ITimesheetResource } from './timesheet'

export interface IEmployeeResource extends IUserBase {
    accountType: 'Employee'
    branch?: IBranchResource
    longitude?: number
    latitude?: number
    timesheets?: ITimesheetResource[]
    role?: IRolesResource
    footsteps?: IFootstepResource[]
}
