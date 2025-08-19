import { IOrgIdentity, TEntityId } from '@/types'

import { IMemberType } from '../member-type/member-type.types'

export interface IBranchSettings extends IOrgIdentity {
    id: TEntityId

    branch_id: TEntityId

    withdraw_allow_user_input: boolean
    /** Validation: omitempty */
    withdraw_prefix: string
    /** Validation: min=0 */
    withdraw_or_start: number
    /** Validation: min=0 */
    withdraw_or_current: number
    /** Validation: min=0 */
    withdraw_or_end: number
    /** Validation: min=0 */
    withdraw_or_iteration: number
    withdraw_or_unique: boolean
    withdraw_use_date_or: boolean
    deposit_allow_user_input: boolean
    /** Validation: omitempty */
    deposit_prefix: string
    /** Validation: min=0 */
    deposit_or_start: number
    /** Validation: min=0 */
    deposit_or_current: number
    /** Validation: min=0 */
    deposit_or_end: number
    /** Validation: min=0 */
    deposit_or_iteration: number
    deposit_or_unique: boolean
    deposit_use_date_or: boolean
    loan_allow_user_input: boolean
    /** Validation: omitempty */
    loan_prefix: string
    /** Validation: min=0 */
    loan_or_start: number
    /** Validation: min=0 */
    loan_or_current: number
    /** Validation: min=0 */
    loan_or_end: number
    /** Validation: min=0 */
    loan_or_iteration: number
    loan_or_unique: boolean
    loan_use_date_or: boolean
    check_voucher_allow_user_input: boolean
    /** Validation: omitempty */
    check_voucher_prefix: string
    /** Validation: min=0 */
    check_voucher_or_start: number
    /** Validation: min=0 */
    check_voucher_or_current: number
    /** Validation: min=0 */
    check_voucher_or_end: number
    /** Validation: min=0 */
    check_voucher_or_iteration: number
    check_voucher_or_unique: boolean
    check_voucher_use_date_or: boolean

    default_member_type_id: TEntityId
    default_member_type: IMemberType
}

export interface IBranchSettingsRequest
    extends Omit<
        IBranchSettings,
        'default_member_type' | 'organization' | 'organization_id'
    > {}
