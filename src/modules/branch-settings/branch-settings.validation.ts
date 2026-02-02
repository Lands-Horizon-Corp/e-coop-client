import z from 'zod'

import { entityIdSchema } from '@/validation'

import { UnbalanceAccountSchema } from '../unbalance-account'

export const BranchSettingRequestSchema = z.object({
    withdraw_allow_user_input: z.boolean(),
    withdraw_prefix: z.string().optional().or(z.literal('')),
    withdraw_or_start: z.coerce.number(),
    withdraw_or_current: z.coerce.number(),
    withdraw_or_end: z.coerce.number(),
    withdraw_or_iteration: z.coerce.number(),
    withdraw_use_date_or: z.boolean(),
    withdraw_padding: z.coerce.number(),
    withdraw_common_or: z.string().optional().or(z.literal('')),

    deposit_or_start: z.coerce.number(),
    deposit_or_current: z.coerce.number(),
    deposit_or_end: z.coerce.number(),
    deposit_or_iteration: z.coerce.number(),
    deposit_use_date_or: z.boolean(),
    deposit_padding: z.coerce.number(),
    deposit_common_or: z.string().optional().or(z.literal('')),

    cash_check_voucher_allow_user_input: z.boolean(),
    cash_check_voucher_or_unique: z.boolean(),
    cash_check_voucher_prefix: z.string().optional().or(z.literal('')),
    cash_check_voucher_or_start: z.coerce.number(),
    cash_check_voucher_or_current: z.coerce.number(),
    cash_check_voucher_padding: z.coerce.number(),

    journal_voucher_allow_user_input: z.boolean(),
    journal_voucher_or_unique: z.boolean(),
    journal_voucher_prefix: z.string().optional().or(z.literal('')),
    journal_voucher_or_start: z.coerce.number(),
    journal_voucher_or_current: z.coerce.number(),
    journal_voucher_padding: z.coerce.number(),

    adjustment_voucher_allow_user_input: z.boolean(),
    adjustment_voucher_or_unique: z.boolean(),
    adjustment_voucher_prefix: z.string().optional().or(z.literal('')),
    adjustment_voucher_or_start: z.coerce.number(),
    adjustment_voucher_or_current: z.coerce.number(),
    adjustment_voucher_padding: z.coerce.number(),

    loan_voucher_allow_user_input: z.boolean(),
    loan_voucher_or_unique: z.boolean(),
    loan_voucher_prefix: z.string().optional().or(z.literal('')),
    loan_voucher_or_start: z.coerce.number(),
    loan_voucher_or_current: z.coerce.number(),
    loan_voucher_padding: z.coerce.number(),

    check_voucher_general: z.boolean(),
    check_voucher_general_allow_user_input: z.boolean(),
    check_voucher_general_or_unique: z.boolean(),
    check_voucher_general_prefix: z.string().optional().or(z.literal('')),
    check_voucher_general_or_start: z.coerce.number(),
    check_voucher_general_or_current: z.coerce.number(),
    check_voucher_general_padding: z.coerce.number(),

    // FOR MEMBER DEFAULT CREATIONS
    default_member_gender_id: entityIdSchema.optional(),
    default_member_type_id: entityIdSchema.optional(),
    default_member_type: z.any(),

    // FOR MEMBER PB GENERATION
    member_profile_passbook_allow_user_input: z.boolean(),
    member_profile_passbook_or_unique: z.boolean(),
    member_profile_passbook_prefix: z.string().optional().or(z.literal('')),
    member_profile_passbook_or_start: z.coerce.number(),
    member_profile_passbook_or_current: z.coerce.number(),
    member_profile_passbook_padding: z.coerce.number(),

    loan_applied_equal_to_balance: z.boolean(),
    annual_divisor: z.coerce.number(),
    tax_interest: z.coerce.number(),
})

export type TBranchSettingsRequestSchema = z.infer<
    typeof BranchSettingRequestSchema
>

export const BranchSettingsCurrencySchema = z.object({
    currency_id: entityIdSchema,
    cash_on_hand_account_id: entityIdSchema,
    paid_up_shared_capital_account_id: entityIdSchema,
    account_wallet_id: entityIdSchema,

    compassion_fund_account_id: entityIdSchema.optional().nullable(),

    unbalanced_accounts: z
        .array(UnbalanceAccountSchema)
        .default([])
        .refine(
            (items) => {
                const set = new Set()
                for (const i of items) {
                    if (set.has(i.currency_id)) return false
                    set.add(i.currency_id)
                }
                return true
            },
            { error: 'Currency must not repeat.' }
        ),

    unbalanced_account_delete_ids: z.array(entityIdSchema).default([]),

    currency: z.any(),
    cash_on_hand_account: z.any(),
    paid_up_shared_capital_account: z.any(),
    account_wallet: z.any(),
    compassion_fund_account: z.any(),
})

export type TBranchSettingsCurrencySchema = z.infer<
    typeof BranchSettingsCurrencySchema
>
