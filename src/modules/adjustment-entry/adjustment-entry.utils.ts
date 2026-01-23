import { TORAdjustmentVoucherSettings } from '.'
import { buildOR } from '../or-builder'

export const isAllowedInputAdjustmentVoucherOR = (
    orOptions?: TORAdjustmentVoucherSettings
) => {
    if (!orOptions) return true

    return orOptions.adjustment_voucher_allow_user_input
}

export const buildAdjustmentVoucherOR = (
    orOptions: TORAdjustmentVoucherSettings
) => {
    const padding = orOptions.adjustment_voucher_padding
    const currentOr = orOptions.adjustment_voucher_or_current
    const prefix = orOptions.adjustment_voucher_prefix

    return buildOR({ currentOr, prefix, padding })
}
