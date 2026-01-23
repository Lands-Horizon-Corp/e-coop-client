import { describe, expect, it } from 'vitest'

import { TORAdjustmentVoucherSettings } from '.'
import { buildAdjustmentVoucherOR } from './adjustment-entry.utils'

describe('buildAdjustmentVoucherOR', () => {
    const baseSettings: TORAdjustmentVoucherSettings = {
        adjustment_voucher_allow_user_input: false,
        adjustment_voucher_prefix: 'ADJ-',
        adjustment_voucher_or_start: 1,
        adjustment_voucher_or_current: 12,
        adjustment_voucher_or_iteration: 1,
        adjustment_voucher_padding: 5,
    }

    it('builds OR using adjustment voucher config', () => {
        const result = buildAdjustmentVoucherOR(baseSettings)

        // current = 12, padding = 5 → 00012
        expect(result).toBe('ADJ-00012')
    })

    it('respects custom prefix', () => {
        const result = buildAdjustmentVoucherOR({
            ...baseSettings,
            adjustment_voucher_prefix: 'AE-',
        })

        expect(result).toBe('AE-00012')
    })

    it('respects different padding values', () => {
        const result = buildAdjustmentVoucherOR({
            ...baseSettings,
            adjustment_voucher_or_current: 7,
            adjustment_voucher_padding: 3,
        })

        expect(result).toBe('ADJ-007')
    })

    it('does not truncate when padding is smaller than OR length', () => {
        const result = buildAdjustmentVoucherOR({
            ...baseSettings,
            adjustment_voucher_or_current: 12345,
            adjustment_voucher_padding: 3,
        })

        expect(result).toBe('ADJ-12345')
    })

    it('handles zero OR values correctly', () => {
        const result = buildAdjustmentVoucherOR({
            ...baseSettings,
            adjustment_voucher_or_current: 0,
            adjustment_voucher_padding: 4,
        })

        expect(result).toBe('ADJ-0000')
    })
})
