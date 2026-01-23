import { buildOR } from '../or-builder'
import { TORCashCheckSettings } from './cash-check-voucher.types'

export const isAllowedInputCashCheckOR = (orOptions?: TORCashCheckSettings) => {
    if (!orOptions) return true

    return orOptions.check_voucher_general
        ? orOptions.check_voucher_general_allow_user_input
        : orOptions.cash_check_voucher_allow_user_input
}

export const buildCashCheckOR = (orOptions: TORCashCheckSettings) => {
    const shouldUseGeneral = orOptions.check_voucher_general

    const padding = shouldUseGeneral
        ? orOptions.check_voucher_general_padding
        : orOptions.cash_check_voucher_padding

    const currentOr = shouldUseGeneral
        ? orOptions.check_voucher_general_or_current
        : orOptions.cash_check_voucher_or_current
    const prefix = shouldUseGeneral
        ? orOptions.check_voucher_general_prefix
        : orOptions.cash_check_voucher_prefix

    return buildOR({ currentOr, prefix, padding })
}
