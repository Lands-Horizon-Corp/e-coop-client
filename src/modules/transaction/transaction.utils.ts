import { mmddyyyy } from '@/helpers/date-utils'

import { buildOR } from '../or-builder'
import { TPaymentMode } from '../quick-transfer'
import {
    QuickTransferOR,
    toORBuilderOptions,
} from '../quick-transfer/quick-transfer.utils'
import { IUserOrganization } from '../user-organization'

export const receiptPrefix = (num: number): string => {
    if (num <= 26) return ''
    let n = num - 26
    const chars: string[] = []
    while (n > 0) {
        n--
        chars.push(String.fromCharCode(65 + (n % 26)))
        n = Math.floor(n / 26)
    }
    return chars.reverse().join('')
}

export const paymentORResolver = (userOrg: IUserOrganization): string => {
    const {
        payment_or_current,
        payment_padding,
        payment_prefix,
        payment_or_use_date_or,
        time_machine_time,
        payment_or_iteration,
    } = userOrg

    if (payment_or_use_date_or) {
        return (
            (payment_prefix || '') +
            mmddyyyy(new Date(time_machine_time ?? new Date()))
        )
    }
    return `${payment_prefix || ''}${receiptPrefix(payment_or_iteration)}${payment_or_current.toString().padStart(payment_padding, '0') || ''}`
}

const resolveDateOR = (useDateOR: boolean, date: Date, prefix = '') => {
    if (!useDateOR) return null
    return prefix + mmddyyyy(date)
}

interface QuickPaymentORResolverArgs {
    type: Omit<TPaymentMode, 'payment'>
    userOrg: IUserOrganization
}

export const quickPaymentORResolver = ({
    type,
    userOrg,
}: QuickPaymentORResolverArgs): string => {
    const {
        branch: { branch_setting },
    } = userOrg

    const orSetting = buildOR(
        toORBuilderOptions(QuickTransferOR(branch_setting, type))
    )

    const now = new Date(userOrg.time_machine_time ?? Date.now())

    if (type === 'withdraw') {
        const { withdraw_use_date_or, withdraw_prefix } = branch_setting

        return (
            resolveDateOR(withdraw_use_date_or, now, withdraw_prefix ?? '') ??
            orSetting
        )
    }

    const { deposit_use_date_or } = branch_setting

    return resolveDateOR(deposit_use_date_or, now) ?? orSetting
}
