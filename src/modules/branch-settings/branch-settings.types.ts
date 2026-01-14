import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { ICurrency } from '../currency'
import { IMemberGender } from '../member-gender'
import { IMemberType } from '../member-type'
import { IUnbalanceAccount } from '../unbalance-account'
import {
    BranchSettingsSchema,
    TBranchSettingsCurrencySchema,
} from './branch-settings.validation'

export interface IBranchSettings extends IBaseEntityMeta {
    id: TEntityId

    currency_id: TEntityId
    currency: ICurrency

    cash_on_hand_account_id?: TEntityId
    cash_on_hand_account?: IAccount

    paid_up_shared_capital_account_id?: TEntityId
    paid_up_shared_capital_account?: IAccount

    compassion_fund_account_id?: TEntityId
    compassion_fund_account?: IAccount

    /** Withdraw OR Settings */
    withdraw_allow_user_input: boolean
    withdraw_prefix: string
    withdraw_or_start: number
    withdraw_or_current: number
    withdraw_or_end: number
    withdraw_or_iteration: number
    withdraw_use_date_or: boolean
    withdraw_padding: number
    withdraw_common_or?: string

    /** Deposit OR Settings */
    deposit_or_start: number
    deposit_or_current: number
    deposit_or_end: number
    deposit_or_iteration: number
    deposit_use_date_or: boolean
    deposit_padding: number
    deposit_common_or?: string

    /** Cash Check Voucher */
    cash_check_voucher_allow_user_input: boolean
    cash_check_voucher_or_unique: boolean
    cash_check_voucher_prefix: string
    cash_check_voucher_or_start: number
    cash_check_voucher_or_current: number
    cash_check_voucher_or_iteration: number
    cash_check_voucher_padding: number

    /** Journal Voucher */
    journal_voucher_allow_user_input: boolean
    journal_voucher_or_unique: boolean
    journal_voucher_prefix: string
    journal_voucher_or_start: number
    journal_voucher_or_current: number
    journal_voucher_or_iteration: number
    journal_voucher_padding: number

    /** Adjustment Voucher */
    adjustment_voucher_allow_user_input: boolean
    adjustment_voucher_or_unique: boolean
    adjustment_voucher_prefix: string
    adjustment_voucher_or_start: number
    adjustment_voucher_or_current: number
    adjustment_voucher_or_iteration: number
    adjustment_voucher_padding: number

    /** Loan Voucher */
    loan_voucher_allow_user_input: boolean
    loan_voucher_or_unique: boolean
    loan_voucher_prefix: string
    loan_voucher_or_start: number
    loan_voucher_or_current: number
    loan_voucher_or_iteration: number
    loan_voucher_padding: number
    loan_applied_equal_to_balance: boolean
    /** Check Voucher – General */
    check_voucher_general: boolean
    check_voucher_general_allow_user_input: boolean
    check_voucher_general_or_unique: boolean
    check_voucher_general_prefix: string
    check_voucher_general_or_start: number
    check_voucher_general_or_current: number
    check_voucher_general_or_iteration: number
    check_voucher_general_padding: number

    tax_interest: number // percentage

    default_member_gender_id?: TEntityId
    default_member_gender?: IMemberGender

    default_member_type_id?: TEntityId
    default_member_type?: IMemberType

    /** Accounting */
    annual_divisor: number

    /** Unbalanced Accounts */
    unbalanced_accounts?: IUnbalanceAccount[]
}

export type IBranchSettingsRequest = z.infer<typeof BranchSettingsSchema>

export interface IBranchSettingsPaginated
    extends IPaginatedResult<IBranchSettings> {}

//  FOR BRANCH SETTINGS CURRENCY

export type IBranchSettingsCurrencyRequest = TBranchSettingsCurrencySchema
