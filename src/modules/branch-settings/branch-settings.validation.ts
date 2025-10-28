import z from 'zod'

import { entityIdSchema } from '@/validation'

import { UnbalanceAccountSchema } from '../unbalance-account'

export const BranchSettingsSchema = z.object({
    id: entityIdSchema,
    branch_id: entityIdSchema,

    // Default Accounts
    cash_on_hand_account_id: entityIdSchema,
    cash_on_hand_account: z.any(),

    paid_up_shared_capital_account_id: entityIdSchema,
    paid_up_shared_capital_account: z.any(),

    // Withdraw settings
    withdraw_allow_user_input: z.boolean(),
    withdraw_prefix: z.string(),
    withdraw_or_start: z.coerce.number().min(0, 'Must be 0 or greater'),
    withdraw_or_current: z.coerce.number().min(0, 'Must be 0 or greater'),
    withdraw_or_end: z.coerce.number().min(0, 'Must be 0 or greater'),
    withdraw_or_iteration: z.coerce.number().min(0, 'Must be 0 or greater'),
    withdraw_or_unique: z.boolean(),
    withdraw_use_date_or: z.boolean(),

    // Deposit settings
    deposit_allow_user_input: z.boolean(),
    deposit_prefix: z.string(),
    deposit_or_start: z.coerce.number().min(0, 'Must be 0 or greater'),
    deposit_or_current: z.coerce.number().min(0, 'Must be 0 or greater'),
    deposit_or_end: z.coerce.number().min(0, 'Must be 0 or greater'),
    deposit_or_iteration: z.coerce.number().min(0, 'Must be 0 or greater'),
    deposit_or_unique: z.boolean(),
    deposit_use_date_or: z.boolean(),

    // Loan settings
    loan_allow_user_input: z.boolean(),
    loan_prefix: z.string(),
    loan_or_start: z.coerce.number().min(0, 'Must be 0 or greater'),
    loan_or_current: z.coerce.number().min(0, 'Must be 0 or greater'),
    loan_or_end: z.coerce.number().min(0, 'Must be 0 or greater'),
    loan_or_iteration: z.coerce.number().min(0, 'Must be 0 or greater'),
    loan_or_unique: z.boolean(),
    loan_use_date_or: z.boolean(),

    // Check Voucher settings
    check_voucher_allow_user_input: z.boolean(),
    check_voucher_prefix: z.string(),
    check_voucher_or_start: z.coerce.number().min(0, 'Must be 0 or greater'),
    check_voucher_or_current: z.coerce.number().min(0, 'Must be 0 or greater'),
    check_voucher_or_end: z.coerce.number().min(0, 'Must be 0 or greater'),
    check_voucher_or_iteration: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    check_voucher_or_unique: z.boolean(),
    check_voucher_use_date_or: z.boolean(),

    default_member_type_id: entityIdSchema,

    loan_applied_equal_to_balance: z.boolean().default(true),
})

export type TBranchSettingsSchema = z.infer<typeof BranchSettingsSchema>

export const BranchSettingsCurrencySchema = z.object({
    currency_id: entityIdSchema,
    currency: z.any(),

    cash_on_hand_account_id: entityIdSchema,
    cash_on_hand_account: z.any(),

    paid_up_shared_capital_account_id: entityIdSchema,
    paid_up_shared_capital_account: z.any(),

    unbalanced_accounts: z
        .array(UnbalanceAccountSchema)
        .default([])
        .refine(
            (unbalancedAccounts) => {
                const value = new Set()

                for (const data of unbalancedAccounts) {
                    if (value.has(data.currency_id)) {
                        return false
                    }
                    value.add(data.currency_id)
                }

                return true
            },
            {
                path: [''],
                error: 'Currency must not repeat.',
            }
        ),
    unbalanced_account_delete_ids: z.array(entityIdSchema).default([]),

    // account_for_overflow_id: entityIdSchema,
    // account_for_overflow: z.any(),

    // account_for_underflow_id: entityIdSchema,
    // account_for_underflow: z.any(),
})

export type TBranchSettingsCurrencySchema = z.infer<
    typeof BranchSettingsCurrencySchema
>
