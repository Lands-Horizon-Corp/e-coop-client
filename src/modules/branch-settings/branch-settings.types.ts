import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { ICurrency } from '../currency'
import { IMemberGender } from '../member-gender'
import { IMemberType } from '../member-type'
import { IUnbalanceAccount } from '../unbalance-account'
import {
    BranchSettingRequestSchema,
    TBranchSettingsCurrencySchema,
} from './branch-settings.validation'

export interface ICashCheckVoucherGeneralORSettings {
    /** Check Voucher – General */
    check_voucher_general: boolean
    check_voucher_general_allow_user_input: boolean
    check_voucher_general_or_unique: boolean
    check_voucher_general_prefix: string
    check_voucher_general_or_start: number
    check_voucher_general_or_current: number
    check_voucher_general_or_iteration: number
    check_voucher_general_padding: number
}

export interface ILoanVoucherORSettings {
    /** Loan Voucher */
    loan_voucher_allow_user_input: boolean
    loan_voucher_or_unique: boolean
    loan_voucher_prefix: string
    loan_voucher_or_start: number
    loan_voucher_or_current: number
    loan_voucher_or_iteration: number
    loan_voucher_padding: number
    loan_applied_equal_to_balance: boolean
}

export interface ICashVoucherORSettings {
    /** Cash Check Voucher */
    cash_check_voucher_allow_user_input: boolean
    cash_check_voucher_or_unique: boolean
    cash_check_voucher_prefix: string
    cash_check_voucher_or_start: number
    cash_check_voucher_or_current: number
    cash_check_voucher_or_iteration: number
    cash_check_voucher_padding: number
}

export interface IJournalVoucherORSettings {
    /** Journal Voucher */
    journal_voucher_allow_user_input: boolean
    journal_voucher_or_unique: boolean
    journal_voucher_prefix: string
    journal_voucher_or_start: number
    journal_voucher_or_current: number
    journal_voucher_or_iteration: number
    journal_voucher_padding: number
}

export interface IAdjustmentVoucherSettings {
    /** Adjustment Voucher */
    adjustment_voucher_allow_user_input: boolean
    adjustment_voucher_or_unique: boolean
    adjustment_voucher_prefix: string
    adjustment_voucher_or_start: number
    adjustment_voucher_or_current: number
    adjustment_voucher_or_iteration: number
    adjustment_voucher_padding: number
}

export interface IMemberPassbookSettings {
    /**  FOR MEMBMER PB GENERATOR/ROTATION */
    member_profile_passbook_allow_user_input: boolean
    member_profile_passbook_or_unique: boolean
    member_profile_passbook_prefix: string
    member_profile_passbook_or_start: number
    member_profile_passbook_or_current: number
    member_profile_passbook_padding: number
}

export interface IWithdrawSetting {
    withdraw_allow_user_input: boolean
    withdraw_prefix: string
    withdraw_or_start: number
    withdraw_or_current: number
    withdraw_or_end: number
    withdraw_or_iteration: number
    withdraw_use_date_or: boolean
    withdraw_padding: number
    withdraw_common_or?: string
}

export interface IDepositSetting {
    deposit_or_start: number
    deposit_or_current: number
    deposit_or_end: number
    deposit_or_iteration: number
    deposit_use_date_or: boolean
    deposit_padding: number
    deposit_common_or?: string
}
export interface IBranchSettings
    extends
        IBaseEntityMeta,
        ICashCheckVoucherGeneralORSettings,
        ILoanVoucherORSettings,
        ICashVoucherORSettings,
        IAdjustmentVoucherSettings,
        IJournalVoucherORSettings,
        IWithdrawSetting,
        IMemberPassbookSettings,
        IDepositSetting {
    id: TEntityId

    currency_id: TEntityId
    currency: ICurrency

    default_member_type_id?: TEntityId
    default_member_type?: IMemberType
    cash_on_hand_account_id?: TEntityId
    cash_on_hand_account?: IAccount

    paid_up_shared_capital_account_id?: TEntityId
    paid_up_shared_capital_account?: IAccount

    compassion_fund_account_id?: TEntityId
    compassion_fund_account?: IAccount

    unbalanced_accounts?: IUnbalanceAccount[]
    annual_divisor: number
    tax_interest: number

    default_member_gender_id?: TEntityId
    default_member_gender?: IMemberGender

    account_wallet_id?: TEntityId
    account_wallet?: IAccount
}

export type IBranchSettingsRequest = z.infer<typeof BranchSettingRequestSchema>

export interface IBranchSettingsPaginated extends IPaginatedResult<IBranchSettings> {}

//  FOR BRANCH SETTINGS CURRENCY

export type IBranchSettingsCurrencyRequest = TBranchSettingsCurrencySchema
