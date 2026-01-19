import { mmddyyyy } from '@/helpers/date-utils'

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

export const paymentORBuilder = (userOrg: IUserOrganization): string => {
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
