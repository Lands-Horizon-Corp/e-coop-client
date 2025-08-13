import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IOrganization } from '../lands-types'
import { IMedia } from './media'
import { IMemberType } from './member/member-type'
import { IPaginatedResult } from './paginated-result'

export enum branchTypeEnum {
    CooperativeBranch = 'cooperative branch',
    BusinessBranch = 'business branch',
    BankingBranch = 'banking branch',
}

// Resource
export interface IBranch extends ITimeStamps, IAuditable, IBranchSettings {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    media_id: string | null
    media: IMedia

    type: branchTypeEnum
    name: string
    email: string

    description?: string
    country_code?: string
    contact_number?: string

    address: string
    province: string
    city: string
    region: string
    barangay: string
    postal_code: string

    latitude: number
    longitude: number

    is_main_branch: boolean
}

export interface IBranchRequest {
    id?: TEntityId

    media_id: string | null

    type: branchTypeEnum
    name: string
    email: string

    description: string
    country_code: string
    contact_number: string

    address: string
    province: string
    city: string
    region: string
    barangay: string
    postal_code: string

    latitude?: number
    longitude?: number

    is_main_branch: boolean
    is_admin_verified?: boolean
}

export interface IBranchPaginated extends IPaginatedResult<IBranch> {}

export interface IBranchSettings {
    branch_setting_withdraw_allow_user_input: boolean
    /** Validation: omitempty */
    branch_setting_withdraw_prefix: string
    /** Validation: min=0 */
    branch_setting_withdraw_or_start: number
    /** Validation: min=0 */
    branch_setting_withdraw_or_current: number
    /** Validation: min=0 */
    branch_setting_withdraw_or_end: number
    /** Validation: min=0 */
    branch_setting_withdraw_or_iteration: number
    branch_setting_withdraw_or_unique: boolean
    branch_setting_withdraw_use_date_or: boolean
    branch_setting_deposit_allow_user_input: boolean
    /** Validation: omitempty */
    branch_setting_deposit_prefix: string
    /** Validation: min=0 */
    branch_setting_deposit_or_start: number
    /** Validation: min=0 */
    branch_setting_deposit_or_current: number
    /** Validation: min=0 */
    branch_setting_deposit_or_end: number
    /** Validation: min=0 */
    branch_setting_deposit_or_iteration: number
    branch_setting_deposit_or_unique: boolean
    branch_setting_deposit_use_date_or: boolean
    branch_setting_loan_allow_user_input: boolean
    /** Validation: omitempty */
    branch_setting_loan_prefix: string
    /** Validation: min=0 */
    branch_setting_loan_or_start: number
    /** Validation: min=0 */
    branch_setting_loan_or_current: number
    /** Validation: min=0 */
    branch_setting_loan_or_end: number
    /** Validation: min=0 */
    branch_setting_loan_or_iteration: number
    branch_setting_loan_or_unique: boolean
    branch_setting_loan_use_date_or: boolean
    branch_setting_check_voucher_allow_user_input: boolean
    /** Validation: omitempty */
    branch_setting_check_voucher_prefix: string
    /** Validation: min=0 */
    branch_setting_check_voucher_or_start: number
    /** Validation: min=0 */
    branch_setting_check_voucher_or_current: number
    /** Validation: min=0 */
    branch_setting_check_voucher_or_end: number
    /** Validation: min=0 */
    branch_setting_check_voucher_or_iteration: number
    branch_setting_check_voucher_or_unique: boolean
    branch_setting_check_voucher_use_date_or: boolean

    branch_setting_default_member_type_id: TEntityId
    branch_setting_default_member_type: IMemberType
}

export interface IBranchSettingsRequest extends IBranchSettings {}
