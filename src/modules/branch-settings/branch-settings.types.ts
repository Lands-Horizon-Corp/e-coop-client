import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { IMemberType } from '../member-type'
import { BranchSettingsSchema } from './branch-settings.validation'

export interface IBranchSettings extends IBaseEntityMeta {
    id: TEntityId

    branch_id: TEntityId

    cash_on_hand_account_id: TEntityId
    cash_on_hand_account: IAccount

    paid_up_shared_capital_account_id: TEntityId
    paid_up_shared_capital_account: IAccount

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

    loan_applied_equal_to_balance: boolean
}

export type IBranchSettingsRequest = z.infer<typeof BranchSettingsSchema>

export interface IBranchSettingsPaginated
    extends IPaginatedResult<IBranchSettings> {}
