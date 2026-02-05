import {
    IBranchSettings,
    IDepositSetting,
    IWithdrawSetting,
} from '../branch-settings'
import { TORBuilderOptions } from '../or-builder'
import { TPaymentMode } from './quick-transfer.types'

type TORSettingResult =
    | { mode: 'withdraw'; setting: IWithdrawSetting }
    | { mode: 'deposit'; setting: IDepositSetting }

export const QuickTransferOR = (
    branchSetting: IBranchSettings,
    mode: Omit<TPaymentMode, 'payment'>
): TORSettingResult => {
    const {
        withdraw_allow_user_input,
        withdraw_prefix,
        withdraw_or_start,
        withdraw_or_current,
        withdraw_or_end,
        withdraw_or_iteration,
        withdraw_use_date_or,
        withdraw_padding,
        withdraw_common_or,

        deposit_or_start,
        deposit_or_current,
        deposit_or_end,
        deposit_or_iteration,
        deposit_use_date_or,
        deposit_padding,
        deposit_common_or,
    } = branchSetting

    if (mode === 'withdraw') {
        return {
            mode: 'withdraw',
            setting: {
                withdraw_allow_user_input,
                withdraw_prefix,
                withdraw_or_start,
                withdraw_or_current,
                withdraw_or_end,
                withdraw_or_iteration,
                withdraw_use_date_or,
                withdraw_padding,
                withdraw_common_or,
            },
        }
    }

    return {
        mode: 'deposit',
        setting: {
            deposit_or_start,
            deposit_or_current,
            deposit_or_end,
            deposit_or_iteration,
            deposit_use_date_or,
            deposit_padding,
            deposit_common_or,
        },
    }
}

export const toORBuilderOptions = (
    orSetting: TORSettingResult
): TORBuilderOptions => {
    if (orSetting.mode === 'withdraw') {
        const s = orSetting.setting

        return {
            currentOr: s.withdraw_or_current,
            padding: s.withdraw_padding,
            prefix: s.withdraw_common_or ?? s.withdraw_prefix,
        }
    }

    const s = orSetting.setting

    return {
        currentOr: s.deposit_or_current,
        padding: s.deposit_padding,
        prefix: s.deposit_common_or,
    }
}
