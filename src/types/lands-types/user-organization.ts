import { USER_ORG_APPLICATION_STATUS } from '@/constants'

import { IUserBase } from '../auth/user'
import { IBaseEntityMeta, TEntityId, TUserType } from '../common'
import { IBranch, IPaginatedResult, TPermission } from '../coop-types'
import { IOrganization } from './organization'

export type TUserOrganizationApplicationStatus =
    (typeof USER_ORG_APPLICATION_STATUS)[number]

export interface IUserOrganization<TUser = IUserBase>
    extends IBaseEntityMeta,
        IUserOrganizationSettings {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    branch_id: TEntityId
    branch: IBranch

    description?: string

    user_id: TEntityId
    user: TUser

    user_type: TUserType

    application_description?: string
    application_status: TUserOrganizationApplicationStatus

    // Perms
    permission_name: string
    permission_description: string
    permissions: TPermission[]
}

export interface IUserOrganizationResponse {
    organization: IOrganization
    user_organization: IUserOrganization
}

export interface UserOrganizationGroup {
    orgnizationId: TEntityId
    userOrganizationId: TEntityId
    organizationDetails: IOrganization
    branches: IBranch[]
    userOrganization: IUserOrganization
    isPending: 'pending' | 'reported' | 'accepted' | 'ban'
}

export interface IOrgUserOrganizationGroup extends IOrganization {
    user_organizations: IUserOrganization[]
}

export interface IUserOrganizationPermissionRequest {
    permission_name: string
    permission_description: string
    permissions: TPermission[]
}

export interface IUserOrganizationSettings {
    user_setting_description: string
    user_setting_start_or: number
    user_setting_end_or: number
    user_setting_used_or: number
    user_setting_start_voucher: number
    user_setting_end_voucher: number
    user_setting_used_voucher: number
    allow_withdraw_negative_balance: boolean
    allow_withdraw_exact_balance: boolean
    maintaining_balance: boolean
}

export interface IUserOrganizationSettingsRequest
    extends IUserOrganizationSettings {}

export interface IUserOrganizationPaginated<TUser = IUserBase>
    extends IPaginatedResult<IUserOrganization<TUser>> {}
