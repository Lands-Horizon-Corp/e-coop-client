import { ITimesheet } from '../timesheet'
import { IUserOrganizationResponse } from '../user-organization'

export interface HeartbeatResponse {
    user_organizations: IUserOrganizationResponse[]
    online_user_organizations: IUserOrganizationResponse[]
    commuting_user_organizations: IUserOrganizationResponse[]
    busy_user_organizations: IUserOrganizationResponse[]
    vacation_user_organizations: IUserOrganizationResponse[]
    online_users_count: number
    online_members: number
    total_members: number
    online_employees: number
    total_employees: number
    total_active_employees: number
    active_employees: ITimesheet
}

/**
 * List of possible user organization statuses
 */
export const USER_ORGANIZATION_STATUSES = [
    'online',
    'offline',
    'busy',
    'vacation',
    'commuting',
] as const

export type UserOrganizationStatus = (typeof USER_ORGANIZATION_STATUSES)[number]

export interface HeartbeatStatusChange {
    /** Validation: required,oneof=online offline busy vacation commuting */
    user_organization_status: UserOrganizationStatus
}
