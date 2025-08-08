import { z } from 'zod'

export const branchSettingsSchema = z.object({
    // Withdraw OR settings
    branch_setting_withdraw_or_start: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_withdraw_or_current: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_withdraw_or_end: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_withdraw_or_iteration: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_withdraw_or_unique: z.boolean(),
    branch_setting_withdraw_use_date_or: z.boolean(),

    // Deposit OR settings
    branch_setting_deposit_or_start: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_deposit_or_current: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_deposit_or_end: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_deposit_or_iteration: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_deposit_or_unique: z.boolean(),
    branch_setting_deposit_use_date_or: z.boolean(),

    // Loan OR settings
    branch_setting_loan_or_start: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_loan_or_current: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_loan_or_end: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_loan_or_iteration: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_loan_or_unique: z.boolean(),
    branch_setting_loan_use_date_or: z.boolean(),

    // Check Voucher OR settings
    branch_setting_check_voucher_or_start: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_check_voucher_or_current: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_check_voucher_or_end: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_check_voucher_or_iteration: z.coerce
        .number()
        .min(0, 'Must be 0 or greater'),
    branch_setting_check_voucher_or_unique: z.boolean(),
    branch_setting_check_voucher_use_date_or: z.boolean(),
})

export type TBranchSettingsFormValues = z.infer<typeof branchSettingsSchema>
