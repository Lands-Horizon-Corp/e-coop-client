import { USER_ORG_APPLICATION_STATUS } from '@/constants'
import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

import { IAccount } from '../account'
import { IBranch } from '../branch'
import { IOrganization } from '../organization'
import { IPaymentType } from '../payment-type/payment-type.types'
import { TPermission } from '../permission'
import { IUserBase, TUserType } from '../user/user.types'

export interface IUserOrganizationContext<
    TUserOrganization = IUserOrganization | undefined,
> {
    user_organization?: TUserOrganization | null
}

export type TUserOrganizationApplicationStatus =
    (typeof USER_ORG_APPLICATION_STATUS)[number]

export interface IUserOrganization<TUser = IUserBase>
    extends IBaseEntityMeta,
        Omit<IUserOrganizationSettings, 'user_type' | 'description'> {
    id: TEntityId

    // organization_id: TEntityId
    // organization: IOrganization

    // branch_id: TEntityId
    // branch: IBranch

    description?: string
    application_description?: string
    user_setting_description: string

    user_id: TEntityId
    user: TUser

    user_type: TUserType

    application_status: TUserOrganizationApplicationStatus

    developer_secret_key: string
    is_seeded: boolean

    /** Permissions */
    permission_name: string
    permission_description: string
    permissions: TPermission[]

    /** Payment OR Settings */
    payment_or_unique: boolean
    payment_or_allow_user_input: boolean
    payment_or_current: number
    payment_or_end: number
    payment_or_iteration: number
    payment_or_use_date_or: boolean
    payment_allow_prefix: boolean
    payment_padding: number

    /** Financial Rules */
    allow_withdraw_negative_balance: boolean
    allow_withdraw_exact_balance: boolean
    maintaining_balance: boolean

    /** Status */
    status: TUserOrganizationApplicationStatus
    last_online_at: string
    time_machine_time?: string

    /** Accounting Defaults */
    settings_accounting_payment_default_value_id?: TEntityId
    settings_accounting_payment_default_value?: IAccount

    settings_accounting_deposit_default_value_id?: TEntityId
    settings_accounting_deposit_default_value?: IAccount

    settings_accounting_withdraw_default_value_id?: TEntityId
    settings_accounting_withdraw_default_value?: IAccount

    settings_payment_type_default_value_id?: TEntityId
    settings_payment_type_default_value?: IPaymentType
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
    user_type: TUserType
    description: string

    user_setting_description: string
    user_setting_start_or: number
    user_setting_end_or: number
    user_setting_used_or: number
    user_setting_start_voucher: number
    user_setting_end_voucher: number
    user_setting_used_voucher: number
    user_setting_number_padding: number

    allow_withdraw_negative_balance: boolean
    allow_withdraw_exact_balance: boolean
    maintaining_balance: boolean

    settings_accounting_payment_default_value_id?: TEntityId | null
    settings_accounting_payment_default_value?: IAccount

    settings_accounting_deposit_default_value_id?: TEntityId | null
    settings_accounting_deposit_default_value?: IAccount

    settings_accounting_withdraw_default_value_id?: TEntityId | null
    settings_accounting_withdraw_default_value?: IAccount

    settings_payment_type_default_value_id?: TEntityId | null
    settings_payment_type_default_value?: IPaymentType

    time_machine_time?: string
}

export interface IUserOrganizationSettingsRequest
    extends IUserOrganizationSettings {}

export interface IUserOrganizationPaginated<TUser = IUserBase>
    extends IPaginatedResult<IUserOrganization<TUser>> {}
